import { hasApiFieldErrors, isApiError } from '@/utils/ts/error/apiError';

export function getApiErrorMessages(error: unknown, fallbackMessage: string): string[] {
  if (isApiError(error)) {
    const fieldErrorMessages = hasApiFieldErrors(error)
      ? Array.from(new Set(error.apiError.fieldErrors.map(({ message }) => message).filter(Boolean)))
      : [];

    if (fieldErrorMessages.length > 0) {
      return fieldErrorMessages;
    }

    if (error.apiError?.message) {
      return [error.apiError.message];
    }

    if (error.message) {
      return [error.message];
    }

    return [fallbackMessage];
  }

  if (error instanceof Error && error.message) {
    return [error.message];
  }

  return [fallbackMessage];
}

export function getApiErrorMessage(error: unknown, fallbackMessage: string): string {
  return getApiErrorMessages(error, fallbackMessage)[0] ?? fallbackMessage;
}
