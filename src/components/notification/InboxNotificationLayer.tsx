import { useEffect, useRef } from 'react';
import { type InfiniteData, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { incrementInboxUnreadCount, prependInboxNotification } from '@/apis/notification/cache';
import type {
  InboxNotification,
  InboxNotificationListResponse,
  InboxNotificationUnreadCountResponse,
} from '@/apis/notification/entity';
import { notificationQueryKeys } from '@/apis/notification/queries';
import { useInAppNotificationToastContext } from '@/contexts/useInAppNotificationToastContext';
import { useAuthStore } from '@/stores/authStore';
import {
  getInboxNotificationMessage,
  getInboxNotificationToastVariant,
  normalizeInboxNotificationPath,
} from '@/utils/ts/notification';
import { useMarkInboxNotificationAsReadMutation } from './hooks/useInboxNotificationMutations';
import { useInboxNotificationStream } from './hooks/useInboxNotificationStream';
import InAppNotificationToast from './InAppNotificationToast';

const MAX_SEEN_NOTIFICATION_COUNT = 50;
const INBOX_RECONNECT_RESYNC_THROTTLE_MS = 10_000;

function InboxNotificationLayer() {
  const queryClient = useQueryClient();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isNotificationListPage = pathname === '/notifications';
  const authStatus = useAuthStore((state) => state.authStatus);
  const lastReconnectResyncAtRef = useRef(0);
  const seenNotificationIdsRef = useRef<number[]>([]);
  const { clearInAppNotificationToasts, dismissInAppNotificationToast, showInAppNotificationToast, toastQueue } =
    useInAppNotificationToastContext();
  const { mutateAsync: markAsRead } = useMarkInboxNotificationAsReadMutation();
  const activeToast = toastQueue[0] ?? null;

  const enqueueNotification = (notification: InboxNotification) => {
    if (seenNotificationIdsRef.current.includes(notification.id)) {
      return;
    }

    seenNotificationIdsRef.current = [notification.id, ...seenNotificationIdsRef.current].slice(
      0,
      MAX_SEEN_NOTIFICATION_COUNT
    );

    queryClient.setQueryData<InboxNotificationUnreadCountResponse>(
      notificationQueryKeys.inbox.unreadCount(),
      (previousData) => (notification.isRead ? previousData : incrementInboxUnreadCount(previousData))
    );

    queryClient.setQueryData<InfiniteData<InboxNotificationListResponse>>(
      notificationQueryKeys.inbox.infinite(),
      (previousData) => prependInboxNotification(previousData, notification)
    );

    if (isNotificationListPage) {
      return;
    }

    showInAppNotificationToast({
      message: getInboxNotificationMessage(notification),
      variant: getInboxNotificationToastVariant(notification),
      onAction: async () => {
        const targetPath = normalizeInboxNotificationPath(notification.path);

        if (!notification.isRead) {
          try {
            await markAsRead({ notificationId: notification.id });
          } catch {
            queryClient.invalidateQueries({ queryKey: notificationQueryKeys.inbox.all() });
          }
        }

        if (targetPath) {
          navigate(targetPath);
        }
      },
    });
  };

  useEffect(() => {
    if (authStatus === 'authenticated') {
      return;
    }

    lastReconnectResyncAtRef.current = 0;
    seenNotificationIdsRef.current = [];
    clearInAppNotificationToasts();
  }, [authStatus, clearInAppNotificationToasts]);

  useEffect(() => {
    if (!isNotificationListPage) {
      return;
    }

    clearInAppNotificationToasts();
  }, [clearInAppNotificationToasts, isNotificationListPage]);

  useEffect(() => {
    if (!activeToast) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      dismissInAppNotificationToast(activeToast.id);
    }, activeToast.durationMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [activeToast, dismissInAppNotificationToast]);

  const handleStreamReconnect = () => {
    const now = Date.now();

    if (now - lastReconnectResyncAtRef.current < INBOX_RECONNECT_RESYNC_THROTTLE_MS) {
      return;
    }

    lastReconnectResyncAtRef.current = now;
    queryClient.invalidateQueries({ queryKey: notificationQueryKeys.inbox.all() });
  };

  useInboxNotificationStream(enqueueNotification, { onReconnect: handleStreamReconnect });

  const handleNotificationAction = async () => {
    if (!activeToast) {
      return;
    }

    dismissInAppNotificationToast(activeToast.id);

    if (activeToast.onAction) {
      await activeToast.onAction();
    }
  };

  if (isNotificationListPage) {
    return null;
  }

  return <InAppNotificationToast toast={activeToast} onAction={() => handleNotificationAction()} />;
}

export default InboxNotificationLayer;
