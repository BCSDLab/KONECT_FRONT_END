import { type InfiniteData, useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getInboxNotifications, getInboxUnreadCount, markInboxNotificationAsRead } from '@/apis/notification';
import { decrementInboxUnreadCount, setInboxNotificationReadState } from '@/apis/notification/cache';
import type { InboxNotificationListResponse, InboxNotificationUnreadCountResponse } from '@/apis/notification/entity';
import { notificationQueryKeys } from '@/apis/notification/queries';
import { useAuthStore } from '@/stores/authStore';

interface MarkInboxNotificationAsReadParams {
  notificationId: number;
  isRead: boolean;
}

export function useUnreadInboxNotificationCount() {
  const authStatus = useAuthStore((state) => state.authStatus);

  const query = useQuery({
    queryKey: notificationQueryKeys.inbox.unreadCount(),
    queryFn: getInboxUnreadCount,
    enabled: authStatus === 'authenticated',
    staleTime: 30_000,
  });

  return {
    ...query,
    unreadCount: query.data?.unreadCount ?? 0,
  };
}

export function useInboxNotifications() {
  return useInfiniteQuery({
    queryKey: notificationQueryKeys.inbox.infinite(),
    queryFn: ({ pageParam = 1 }) => getInboxNotifications(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.currentPage + 1 : undefined),
  });
}

export function useMarkInboxNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ notificationId }: MarkInboxNotificationAsReadParams) => markInboxNotificationAsRead(notificationId),
    onSuccess: (_, { notificationId, isRead }) => {
      queryClient.setQueryData<InfiniteData<InboxNotificationListResponse>>(
        notificationQueryKeys.inbox.infinite(),
        (previousData) => setInboxNotificationReadState(previousData, notificationId)
      );

      if (isRead) {
        return;
      }

      queryClient.setQueryData<InboxNotificationUnreadCountResponse>(
        notificationQueryKeys.inbox.unreadCount(),
        (previousData) => decrementInboxUnreadCount(previousData)
      );
    },
  });
}
