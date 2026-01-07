import type { ApiError, ApiErrorResponse } from '@/interface/error';

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
  const { headers, body, method, params, ...restOptions } = options;

  if (!method) {
    throw new Error('HTTP method가 설정되지 않았습니다.');
  }

  let url = joinUrl(BASE_URL, endPoint);
  if (params && Object.keys(params).length > 0) {
    const query = buildQuery(params as Record<string, QueryParamValue>);
    if (query) url += `?${query}`;
  }

  const abortController = new AbortController();
  const timeoutId = setTimeout(() => abortController.abort(), timeout);

  const isJsonBody = body !== undefined && body !== null && !(body instanceof FormData);

  try {
    const fetchOptions: RequestInit = {
      headers: {
        ...(isJsonBody ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
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
      const errorData = await parseErrorResponse(response);

      const error = new Error(errorData?.message ?? 'API 요청 실패') as ApiError;
      error.status = response.status;
      error.statusText = response.statusText;
      error.url = response.url;
      error.apiError = errorData ?? undefined;

      throw error;
    }

    return parseResponse<T>(response);
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('요청 시간이 초과되었습니다.');
    }
    throw error;
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
