import { type InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import { decrementInboxUnreadCount, setInboxNotificationReadState } from '@/apis/notification/cache';
import type { InboxNotificationListResponse, InboxNotificationUnreadCountResponse } from '@/apis/notification/entity';
import { notificationMutations } from '@/apis/notification/mutations';
import { notificationQueryKeys } from '@/apis/notification/queries';

export const useMarkInboxNotificationAsReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    ...notificationMutations.markInboxAsRead(),
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
};
