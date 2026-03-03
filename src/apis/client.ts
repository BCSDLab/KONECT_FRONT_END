import { refreshAccessToken } from '@/apis/auth';
import type { ApiError, ApiErrorResponse } from '@/interface/error';
import { useAuthStore } from '@/stores/authStore';
import { isServerErrorStatus, redirectToServerErrorPage } from '@/utils/ts/errorRedirect';

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

let refreshPromise: Promise<string> | null = null;

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

async function sendRequest<T = unknown, P extends object = Record<string, QueryParamValue>>(
  endPoint: string,
  options: FetchOptions<P> = {},
  timeout: number = 10000
): Promise<T> {
  const { headers, body, method, params, requiresAuth, ...restOptions } = options;

  if (!method) {
    throw new Error('HTTP method가 설정되지 않았습니다.');
  }

  let url = joinUrl(BASE_URL, endPoint);
  if (params && Object.keys(params).length > 0) {
    const query = buildQuery(params as Record<string, QueryParamValue>);
    if (query) url += `?${query}`;
  }

  const abortController = new AbortController();
  let didTimeout = false;
  const timeoutId = setTimeout(() => {
    didTimeout = true;
    abortController.abort();
  }, timeout);

  const isJsonBody = body !== undefined && body !== null && !(body instanceof FormData);

  const buildHeaders = (): Record<string, string> => {
    const h: Record<string, string> = {
      ...(isJsonBody ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    };

    if (requiresAuth) {
      const accessToken = useAuthStore.getState().getAccessToken();
      if (accessToken) {
        h['Authorization'] = `Bearer ${accessToken}`;
      }
    }

    return h;
  };

  try {
    const fetchOptions: RequestInit = {
      headers: buildHeaders(),
      method,
      signal: abortController.signal,
      credentials: 'include',
      ...restOptions,
    };

    if (body !== undefined && body !== null && !['GET', 'HEAD'].includes(method)) {
      fetchOptions.body =
        typeof body === 'object' && !(body instanceof Blob) && !(body instanceof FormData)
          ? JSON.stringify(body)
          : (body as BodyInit);
    }

    const response = await fetch(url, fetchOptions);

    if (response.status === 401 && requiresAuth) {
      clearTimeout(timeoutId);
      return await handleUnauthorized<T, P>(endPoint, options, timeout);
    }

    if (!response.ok) {
      return await throwApiError(response);
    }

    return parseResponse<T>(response);
  } catch (error) {
    rethrowFetchError(error, url, didTimeout);
  } finally {
    clearTimeout(timeoutId);
  }
}

async function handleUnauthorized<T = unknown, P extends object = Record<string, QueryParamValue>>(
  endPoint: string,
  options: FetchOptions<P>,
  timeout: number
): Promise<T> {
  let newAccessToken: string;

  try {
    if (!refreshPromise) {
      refreshPromise = refreshAccessToken();
    }
    newAccessToken = await refreshPromise;
  } catch {
    // refresh 실패 → 인증 만료, 로그아웃 처리
    useAuthStore.getState().clearAuth();
    throw new Error('인증이 만료되었습니다.');
  } finally {
    refreshPromise = null;
  }

  useAuthStore.getState().setAccessToken(newAccessToken);

  try {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'TOKEN_REFRESH', accessToken: newAccessToken }));
    }
  } catch {
    // 브릿지 전달 실패가 인증 흐름을 중단시키지 않도록 무시
  }

  // retry 실패는 그대로 throw (로그아웃 처리 안 함)
  return await sendRequestWithoutRetry<T, P>(endPoint, options, timeout);
}

async function sendRequestWithoutRetry<T = unknown, P extends object = Record<string, QueryParamValue>>(
  endPoint: string,
  options: FetchOptions<P> = {},
  timeout: number = 10000
): Promise<T> {
  const { headers, body, method, params, requiresAuth, ...restOptions } = options;

  if (!method) {
    throw new Error('HTTP method가 설정되지 않았습니다.');
  }

  let url = joinUrl(BASE_URL, endPoint);
  if (params && Object.keys(params).length > 0) {
    const query = buildQuery(params as Record<string, QueryParamValue>);
    if (query) url += `?${query}`;
  }

  const abortController = new AbortController();
  let didTimeout = false;
  const timeoutId = setTimeout(() => {
    didTimeout = true;
    abortController.abort();
  }, timeout);

  const isJsonBody = body !== undefined && body !== null && !(body instanceof FormData);

  try {
    const h: Record<string, string> = {
      ...(isJsonBody ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    };

    if (requiresAuth) {
      const accessToken = useAuthStore.getState().getAccessToken();
      if (accessToken) {
        h['Authorization'] = `Bearer ${accessToken}`;
      }
    }

    const fetchOptions: RequestInit = {
      headers: h,
      method,
      signal: abortController.signal,
      credentials: 'include',
      ...restOptions,
    };

    if (body !== undefined && body !== null && !['GET', 'HEAD'].includes(method)) {
      fetchOptions.body =
        typeof body === 'object' && !(body instanceof Blob) && !(body instanceof FormData)
          ? JSON.stringify(body)
          : (body as BodyInit);
    }

    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      return await throwApiError(response);
    }

    return parseResponse<T>(response);
  } catch (error) {
    rethrowFetchError(error, url, didTimeout);
  } finally {
    clearTimeout(timeoutId);
  }
}

async function parseErrorResponse(response: Response): Promise<ApiErrorResponse | null> {
  const contentType = response.headers.get('Content-Type') || '';
  if (contentType.includes('application/json')) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }
  return null;
}

async function parseResponse<T = unknown>(response: Response): Promise<T> {
  const contentType = response.headers.get('Content-Type') || '';
  if (contentType.includes('application/json')) {
    try {
      return await response.json();
    } catch {
      return {} as T;
    }
  } else if (contentType.includes('text')) {
    return (await response.text()) as unknown as T;
  } else {
    return null as unknown as T;
  }
}
