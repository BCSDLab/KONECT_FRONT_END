import { refreshAccessToken } from '@/apis/auth';
import { useAuthStore } from '@/stores/authStore';
import { isApiErrorResponse, type ApiError, type ApiErrorResponse } from '@/utils/ts/error/apiError';
import { isServerErrorStatus, redirectToServerErrorPage } from '@/utils/ts/error/errorRedirect';
import { postNativeMessage } from '@/utils/ts/nativeBridge';

const BASE_URL = import.meta.env.VITE_API_PATH;

if (!BASE_URL) {
  throw new Error('API 경로 환경변수가 설정되지 않았습니다.');
}

type QueryAtom = string | number | boolean;
type QueryParamValue = QueryAtom | QueryAtom[];

interface FetchOptions<P extends object = Record<string, QueryParamValue>> extends Omit<RequestInit, 'body'> {
  headers?: Record<string, string>;
  body?: unknown;
  params?: P;
  requiresAuth?: boolean;
}

export const apiClient = {
  get: <T = unknown, P extends object = Record<string, QueryParamValue>>(
    endPoint: string,
    options: FetchOptions<P> = {}
  ) => sendRequest<T, P>(endPoint, { ...options, method: 'GET' }),
  post: <T = unknown, P extends object = Record<string, QueryParamValue>>(
    endPoint: string,
    options: FetchOptions<P> = {}
  ) => sendRequest<T, P>(endPoint, { ...options, method: 'POST' }),
  put: <T = unknown, P extends object = Record<string, QueryParamValue>>(
    endPoint: string,
    options: FetchOptions<P> = {}
  ) => sendRequest<T, P>(endPoint, { ...options, method: 'PUT' }),
  delete: <T = unknown, P extends object = Record<string, QueryParamValue>>(
    endPoint: string,
    options: FetchOptions<P> = {}
  ) => sendRequest<T, P>(endPoint, { ...options, method: 'DELETE' }),
  patch: <T = unknown, P extends object = Record<string, QueryParamValue>>(
    endPoint: string,
    options: FetchOptions<P> = {}
  ) => sendRequest<T, P>(endPoint, { ...options, method: 'PATCH' }),
};

function isFetchNetworkError(error: unknown): error is TypeError {
  if (!(error instanceof TypeError)) return false;

  const message = error.message.toLowerCase();
  return (
    message.includes('failed to fetch') ||
    message.includes('load failed') ||
    message.includes('networkerror') ||
    message.includes('network request failed')
  );
}

async function throwApiError(response: Response): Promise<never> {
  if (isServerErrorStatus(response.status)) {
    redirectToServerErrorPage();
    throw new Error('서버 오류가 발생했습니다.');
  }

  const errorData = await parseErrorResponse(response);

  const error = new Error(errorData?.message ?? 'API 요청 실패') as ApiError;
  error.status = response.status;
  error.statusText = response.statusText;
  error.url = response.url;
  error.apiError = errorData ?? undefined;

  throw error;
}

function rethrowFetchError(error: unknown, url: string, isTimeout = false): never {
  if (error instanceof Error && error.name === 'AbortError') {
    if (isTimeout) {
      const timeoutError = new Error('요청 시간이 초과되었습니다.') as ApiError;
      timeoutError.name = 'TimeoutError';
      timeoutError.status = 0;
      timeoutError.statusText = 'TIMEOUT';
      timeoutError.url = url;
      throw timeoutError;
    }
    const cancelError = new Error('요청이 취소되었습니다.') as ApiError;
    cancelError.name = 'Canceled';
    cancelError.status = 0;
    cancelError.statusText = 'CANCELED';
    cancelError.url = url;
    throw cancelError;
  }
  if (isFetchNetworkError(error)) {
    throw createNetworkApiError(url);
  }
  throw error as Error;
}

function createNetworkApiError(requestUrl: string): ApiError {
  const error = new Error('네트워크 연결에 실패했습니다. 잠시 후 다시 시도해 주세요.') as ApiError;
  error.name = 'NetworkError';
  error.status = 0;
  error.statusText = 'NETWORK_ERROR';
  error.url = requestUrl;
  return error;
}

function joinUrl(baseUrl: string, path: string) {
  const base = baseUrl.replace(/\/+$/, '');
  const p = path.replace(/^\/+/, '');
  return `${base}/${p}`;
}

function buildQuery(params: Record<string, QueryParamValue>) {
  const usp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value == null) continue;
    if (Array.isArray(value)) {
      if (value.length === 0) continue;
      for (const v of value) {
        if (v == null) continue;
        usp.append(key, String(v));
      }
    } else {
      usp.append(key, String(value));
    }
  }
  return usp.toString();
}

function buildUrl(endPoint: string, params?: Record<string, QueryParamValue>): string {
  let url = joinUrl(BASE_URL, endPoint);
  if (params && Object.keys(params).length > 0) {
    const query = buildQuery(params);
    if (query) url += `?${query}`;
  }
  return url;
}

function buildFetchOptions<P extends object>(
  options: FetchOptions<P> & { method: string },
  abortSignal: AbortSignal
): RequestInit {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { headers, body, method, params, requiresAuth, ...restOptions } = options;

  const isPlainObjectOrArray =
    body !== undefined &&
    body !== null &&
    typeof body === 'object' &&
    (Array.isArray(body) || body.constructor === Object);

  const h: Record<string, string> = {
    ...(isPlainObjectOrArray ? { 'Content-Type': 'application/json' } : {}),
    ...headers,
  };

  if (requiresAuth) {
    const accessToken = useAuthStore.getState().getAccessToken();
    if (accessToken) {
      h['Authorization'] = `Bearer ${accessToken}`;
    }
  }

  const fetchOpts: RequestInit = {
    headers: h,
    method,
    signal: abortSignal,
    credentials: 'include',
    ...restOptions,
  };

  if (body !== undefined && body !== null && !['GET', 'HEAD'].includes(method)) {
    fetchOpts.body = isPlainObjectOrArray ? JSON.stringify(body) : (body as BodyInit);
  }

  return fetchOpts;
}

async function executeFetch<P extends object>(
  endPoint: string,
  options: FetchOptions<P> & { method: string },
  timeout: number
): Promise<{ response: Response; timeoutId: ReturnType<typeof setTimeout> }> {
  const url = buildUrl(endPoint, options.params as Record<string, QueryParamValue> | undefined);

  const abortController = new AbortController();
  let didTimeout = false;
  const timeoutId = setTimeout(() => {
    didTimeout = true;
    abortController.abort();
  }, timeout);

  try {
    const fetchOpts = buildFetchOptions(options, abortController.signal);
    const response = await fetch(url, fetchOpts);
    return { response, timeoutId };
  } catch (error) {
    clearTimeout(timeoutId);
    rethrowFetchError(error, url, didTimeout);
  }
}

async function sendRequest<T = unknown, P extends object = Record<string, QueryParamValue>>(
  endPoint: string,
  options: FetchOptions<P> = {},
  timeout: number = 10000,
  allowRetry: boolean = true
): Promise<T> {
  const { method } = options;

  if (!method) {
    throw new Error('HTTP method가 설정되지 않았습니다.');
  }

  const { response, timeoutId } = await executeFetch<P>(
    endPoint,
    options as FetchOptions<P> & { method: string },
    timeout
  );

  const url = response.url;

  try {
    if (response.status === 401 && options.requiresAuth && allowRetry) {
      return await handleUnauthorized<T, P>(endPoint, options, timeout);
    }

    if (!response.ok) {
      return await throwApiError(response);
    }

    return await parseResponse<T>(response);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      rethrowFetchError(error, url, true);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function handleUnauthorized<T = unknown, P extends object = Record<string, QueryParamValue>>(
  endPoint: string,
  options: FetchOptions<P>,
  timeout: number
): Promise<T> {
  await refreshAuthSession();

  return sendRequest<T, P>(endPoint, options, timeout, false);
}

export async function refreshAuthSession(): Promise<string> {
  let newAccessToken: string;

  try {
    newAccessToken = await refreshAccessToken();
  } catch {
    useAuthStore.getState().clearAuth();
    throw new Error('인증이 만료되었습니다.');
  }

  useAuthStore.getState().setAccessToken(newAccessToken);
  postNativeMessage({ type: 'TOKEN_REFRESH', accessToken: newAccessToken });

  return newAccessToken;
}

async function parseErrorResponse(response: Response): Promise<ApiErrorResponse | null> {
  const contentType = response.headers.get('Content-Type') || '';
  if (contentType.includes('application/json')) {
    try {
      const data: unknown = await response.json();
      return isApiErrorResponse(data) ? data : null;
    } catch {
      return null;
    }
  }
  return null;
}

async function parseResponse<T = unknown>(response: Response): Promise<T> {
  if (response.status === 204 || response.headers.get('Content-Length') === '0') {
    return null as unknown as T;
  }

  const contentType = response.headers.get('Content-Type') || '';

  if (contentType.includes('application/json')) {
    const responseText = await response.text();

    if (responseText.trim() === '') {
      return null as unknown as T;
    }

    try {
      return JSON.parse(responseText) as T;
    } catch {
      const error = new Error('응답 JSON 파싱에 실패했습니다.') as ApiError;
      error.name = 'ParseError';
      error.status = response.status;
      error.statusText = response.statusText;
      error.url = response.url;
      throw error;
    }
  }

  if (contentType.includes('text')) {
    return (await response.text()) as unknown as T;
  }

  return null as unknown as T;
}
