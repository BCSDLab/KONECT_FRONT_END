import { useCallback } from 'react';
import { isAuthError, isCanceledError, isServerError } from '@konect/utils/api-error';
import { getApiErrorMessage } from '@konect/utils/api-error-message';
import { useToastContext } from '@/contexts/useToastContext';

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
