import { type InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import { decrementInboxUnreadCount, setInboxNotificationReadState } from '@/apis/notification/cache';
import type { InboxNotificationListResponse, InboxNotificationUnreadCountResponse } from '@/apis/notification/entity';
import { notificationMutations } from '@/apis/notification/mutations';
import { notificationQueryKeys } from '@/apis/notification/queries';

export const useMarkInboxNotificationAsReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    ...notificationMutations.markInboxAsRead(),
    onSuccess: (_, { notificationId }) => {
      let shouldDecrementUnreadCount = false;

      queryClient.setQueryData<InfiniteData<InboxNotificationListResponse>>(
        notificationQueryKeys.inbox.infinite(),
        (previousData) => {
          shouldDecrementUnreadCount =
            previousData?.pages.some((page) =>
              page.notifications.some((notification) => notification.id === notificationId && !notification.isRead)
            ) ?? false;

          return setInboxNotificationReadState(previousData, notificationId);
        }
      );

      if (!shouldDecrementUnreadCount) {
        return;
      }

      queryClient.setQueryData<InboxNotificationUnreadCountResponse>(
        notificationQueryKeys.inbox.unreadCount(),
        (previousData) => decrementInboxUnreadCount(previousData)
      );
    },
  });
};
