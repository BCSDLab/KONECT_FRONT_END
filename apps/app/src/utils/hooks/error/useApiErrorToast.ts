import { useCallback } from 'react';
import { useToastContext } from '@/contexts/useToastContext';
import { isAuthError, isCanceledError, isServerError } from '@/utils/ts/error/apiError';
import { getApiErrorMessage } from '@/utils/ts/error/apiErrorMessage';

export function useApiErrorToast() {
  const { showToast } = useToastContext();

  return useCallback(
    (error: unknown, fallbackMessage: string) => {
      if (isAuthError(error) || isServerError(error) || isCanceledError(error)) {
        return;
      }

      showToast(getApiErrorMessage(error, fallbackMessage), 'error');
    },
    [showToast]
  );
}
