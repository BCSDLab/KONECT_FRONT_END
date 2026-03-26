import { type InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import { decrementInboxUnreadCount, setInboxNotificationReadState } from './cache';
import { notificationMutations } from './mutations';
import { notificationQueryKeys } from './queries';
import type { InboxNotificationListResponse, InboxNotificationUnreadCountResponse } from './entity';

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
