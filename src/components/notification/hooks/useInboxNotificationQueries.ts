import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useMarkInboxNotificationAsReadMutation } from '@/apis/notification/hooks';
import { notificationQueries } from '@/apis/notification/queries';
import { useAuthStore } from '@/stores/authStore';

export function useUnreadInboxNotificationCount() {
  const authStatus = useAuthStore((state) => state.authStatus);

  const query = useQuery({
    ...notificationQueries.inboxUnreadCount(),
    enabled: authStatus === 'authenticated',
    staleTime: 30_000,
  });

  return {
    ...query,
    unreadCount: query.data?.unreadCount ?? 0,
  };
}

export function useInboxNotifications() {
  return useInfiniteQuery(notificationQueries.inboxInfinite());
}

export function useMarkInboxNotificationAsRead() {
  return useMarkInboxNotificationAsReadMutation();
}
