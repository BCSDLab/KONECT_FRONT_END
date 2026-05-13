import { createContext, useContext } from 'react';
import type { InboxNotificationToastVariant } from '@/utils/ts/notification';

export interface InAppNotificationToastRequest {
  message: string;
  variant?: InboxNotificationToastVariant;
  actionLabel?: string;
  onAction?: (() => void | Promise<void>) | null;
  durationMs?: number;
}

export interface InAppNotificationToastItem {
  id: string;
  message: string;
  variant: InboxNotificationToastVariant;
  actionLabel: string;
  onAction: (() => void | Promise<void>) | null;
  durationMs: number;
}

export interface InAppNotificationToastContextType {
  toastQueue: InAppNotificationToastItem[];
  showInAppNotificationToast: (request: InAppNotificationToastRequest) => void;
  dismissInAppNotificationToast: (toastId: string) => void;
  clearInAppNotificationToasts: () => void;
}

export const InAppNotificationToastContext = createContext<InAppNotificationToastContextType | undefined>(undefined);

export function useInAppNotificationToastContext(): InAppNotificationToastContextType {
  const context = useContext(InAppNotificationToastContext);

  if (!context) {
    throw new Error('useInAppNotificationToastContext must be used within an InAppNotificationToastProvider');
  }

  return context;
}
