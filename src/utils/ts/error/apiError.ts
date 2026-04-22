import { isServerErrorStatus } from '@/utils/ts/error/errorRedirect';

export const API_ERROR_CODES = {
  INVALID_SESSION: 'INVALID_SESSION',
  ALREADY_RUNNING_STUDY_TIMER: 'ALREADY_RUNNING_STUDY_TIMER',
  DUPLICATE_STUDENT_NUMBER: 'DUPLICATE_STUDENT_NUMBER',
} as const;

export type ApiErrorCode = (typeof API_ERROR_CODES)[keyof typeof API_ERROR_CODES];
type UnknownApiErrorCode = string & {};

export interface FieldError {
  field: string;
  message: string;
  constraint: string;
}

export interface ApiErrorResponse {
  code: ApiErrorCode | UnknownApiErrorCode;
  message: string;
  errorTraceId: string;
  fieldErrors?: FieldError[];
}

export interface ApiError extends Error {
  status: number;
  statusText: string;
  url: string;
  apiError?: ApiErrorResponse;
}

const AUTH_EXPIRED_ERROR_MESSAGE = '인증이 만료되었습니다.';
const SERVER_ERROR_KEYWORD = '서버 오류';

type ApiErrorWithFieldErrors = ApiError & {
  apiError: ApiErrorResponse & {
    fieldErrors: FieldError[];
  };
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  if (!isRecord(value)) return false;

  const code = value['code'];
  const message = value['message'];
  const errorTraceId = value['errorTraceId'];
  const fieldErrors = value['fieldErrors'];

  if (typeof code !== 'string') return false;
  if (typeof message !== 'string') return false;
  if (typeof errorTraceId !== 'string') return false;

  if (fieldErrors !== undefined) {
    if (!Array.isArray(fieldErrors)) return false;

    for (const fe of fieldErrors) {
      if (!isRecord(fe)) return false;
      if (typeof fe['field'] !== 'string') return false;
      if (typeof fe['message'] !== 'string') return false;
      if (typeof fe['constraint'] !== 'string') return false;
    }
  }

  return true;
}

export function isApiError(value: unknown): value is ApiError {
  if (!isRecord(value)) return false;

  const name = value['name'];
  const message = value['message'];
  const status = value['status'];
  const statusText = value['statusText'];
  const url = value['url'];
  const apiError = value['apiError'];

  if (typeof name !== 'string') return false;
  if (typeof message !== 'string') return false;
  if (typeof status !== 'number') return false;
  if (typeof statusText !== 'string') return false;
  if (typeof url !== 'string') return false;

  if (apiError === undefined) return true;

  return isApiErrorResponse(apiError);
}

export function hasApiFieldErrors(error: unknown): error is ApiErrorWithFieldErrors {
  return isApiError(error) && (error.apiError?.fieldErrors?.length ?? 0) > 0;
}

export function isAuthError(error: unknown): boolean {
  if (isApiError(error)) {
    return error.status === 401 || error.apiError?.code === API_ERROR_CODES.INVALID_SESSION;
  }

  return error instanceof Error && error.message === AUTH_EXPIRED_ERROR_MESSAGE;
}

export function isServerError(error: unknown): boolean {
  if (isApiError(error)) {
    return isServerErrorStatus(error.status);
  }

  return error instanceof Error && error.message.includes(SERVER_ERROR_KEYWORD);
}

export function isNetworkError(error: unknown): boolean {
  return isApiError(error) && error.name === 'NetworkError';
}

export function isTimeoutError(error: unknown): boolean {
  return isApiError(error) && error.name === 'TimeoutError';
}

export function isCanceledError(error: unknown): boolean {
  return isApiError(error) && error.name === 'Canceled';
}
