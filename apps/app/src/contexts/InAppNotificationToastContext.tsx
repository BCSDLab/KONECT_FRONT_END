import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  InAppNotificationToastContext,
  type InAppNotificationToastItem,
  type InAppNotificationToastRequest,
} from './useInAppNotificationToastContext';

const DEFAULT_IN_APP_NOTIFICATION_TOAST_DURATION = 4_500;
const DEFAULT_IN_APP_NOTIFICATION_TOAST_ACTION_LABEL = '확인하기';

interface InAppNotificationToastProviderProps {
  children: ReactNode;
}

export default function InAppNotificationToastProvider({ children }: InAppNotificationToastProviderProps) {
  const [toastQueue, setToastQueue] = useState<InAppNotificationToastItem[]>([]);
  const nextToastIdRef = useRef(0);

  const showInAppNotificationToast = useCallback((request: InAppNotificationToastRequest) => {
    const toast: InAppNotificationToastItem = {
      id: `in-app-toast-${nextToastIdRef.current++}`,
      message: request.message,
      variant: request.variant ?? 'general',
      actionLabel: request.actionLabel ?? DEFAULT_IN_APP_NOTIFICATION_TOAST_ACTION_LABEL,
      onAction: request.onAction ?? null,
      durationMs: request.durationMs ?? DEFAULT_IN_APP_NOTIFICATION_TOAST_DURATION,
    };

    setToastQueue((previousQueue) => [...previousQueue, toast]);
  }, []);

  const dismissInAppNotificationToast = useCallback((toastId: string) => {
    setToastQueue((previousQueue) => previousQueue.filter((toast) => toast.id !== toastId));
  }, []);

  const clearInAppNotificationToasts = useCallback(() => {
    setToastQueue([]);
  }, []);

  const value = useMemo(
    () => ({
      toastQueue,
      showInAppNotificationToast,
      dismissInAppNotificationToast,
      clearInAppNotificationToasts,
    }),
    [clearInAppNotificationToasts, dismissInAppNotificationToast, showInAppNotificationToast, toastQueue]
  );

  return <InAppNotificationToastContext.Provider value={value}>{children}</InAppNotificationToastContext.Provider>;
}
