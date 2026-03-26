import { type InfiniteData, mutationOptions, type QueryClient } from '@tanstack/react-query';
import { decrementInboxUnreadCount, setInboxNotificationReadState } from './cache';
import { notificationQueryKeys } from './queries';
import type { InboxNotificationListResponse, InboxNotificationUnreadCountResponse } from './entity';
import { markInboxNotificationAsRead } from '.';

export interface MarkInboxNotificationAsReadVariables {
  notificationId: number;
  isRead: boolean;
}

export const notificationMutationKeys = {
  markInboxAsRead: () => ['notifications', 'inbox', 'mark-as-read'] as const,
};

export const notificationMutations = {
  markInboxAsRead: (queryClient: QueryClient) =>
    mutationOptions({
      mutationKey: notificationMutationKeys.markInboxAsRead(),
      mutationFn: ({ notificationId }: MarkInboxNotificationAsReadVariables) =>
        markInboxNotificationAsRead(notificationId),
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
    }),
};
