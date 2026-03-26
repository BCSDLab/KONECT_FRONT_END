import { startTransition, useEffect, useRef, useState } from 'react';
import { type InfiniteData, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { incrementInboxUnreadCount, prependInboxNotification } from '@/apis/notification/cache';
import type {
  InboxNotification,
  InboxNotificationListResponse,
  InboxNotificationUnreadCountResponse,
} from '@/apis/notification/entity';
import { notificationQueryKeys } from '@/apis/notification/queries';
import { useAuthStore } from '@/stores/authStore';
import { normalizeInboxNotificationPath } from '@/utils/ts/notification';
import { useMarkInboxNotificationAsRead } from './hooks/useInboxNotificationQueries';
import { useInboxNotificationStream } from './hooks/useInboxNotificationStream';
import InAppNotificationToast from './InAppNotificationToast';

const IN_APP_NOTIFICATION_TOAST_DURATION = 4_500;
const MAX_SEEN_NOTIFICATION_COUNT = 50;

function InboxNotificationLayer() {
  const queryClient = useQueryClient();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const authStatus = useAuthStore((state) => state.authStatus);
  const seenNotificationIdsRef = useRef<number[]>([]);
  const [notificationQueue, setNotificationQueue] = useState<InboxNotification[]>([]);
  const { mutateAsync: markAsRead } = useMarkInboxNotificationAsRead();
  const activeNotification = notificationQueue[0] ?? null;

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

    startTransition(() => {
      setNotificationQueue((previousQueue) => [...previousQueue, notification]);
    });
  };

  useEffect(() => {
    if (authStatus === 'authenticated') {
      return;
    }

    seenNotificationIdsRef.current = [];

    startTransition(() => {
      setNotificationQueue([]);
    });
  }, [authStatus]);

  useEffect(() => {
    if (!activeNotification) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setNotificationQueue((previousQueue) => previousQueue.slice(1));
    }, IN_APP_NOTIFICATION_TOAST_DURATION);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [activeNotification]);
  useInboxNotificationStream(enqueueNotification);

  const handleNotificationAction = async () => {
    if (!activeNotification) {
      return;
    }

    const targetPath = normalizeInboxNotificationPath(activeNotification.path);
    setNotificationQueue((previousQueue) => previousQueue.slice(1));

    if (!activeNotification.isRead) {
      try {
        await markAsRead(activeNotification.id);
      } catch {
        void queryClient.invalidateQueries({ queryKey: notificationQueryKeys.inbox.all() });
      }
    }

    if (targetPath) {
      navigate(targetPath);
    }
  };

  if (pathname === '/notifications') {
    return null;
  }

  return <InAppNotificationToast notification={activeNotification} onAction={() => void handleNotificationAction()} />;
}

export default InboxNotificationLayer;
