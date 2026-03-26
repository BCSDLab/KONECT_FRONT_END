import { mutationOptions } from '@tanstack/react-query';
import { markInboxNotificationAsRead } from '.';

export interface MarkInboxNotificationAsReadVariables {
  notificationId: number;
  isRead: boolean;
}

export const notificationMutationKeys = {
  markInboxAsRead: () => ['notifications', 'inbox', 'mark-as-read'] as const,
};

export const notificationMutations = {
  markInboxAsRead: () =>
    mutationOptions({
      mutationKey: notificationMutationKeys.markInboxAsRead(),
      mutationFn: ({ notificationId }: MarkInboxNotificationAsReadVariables) =>
        markInboxNotificationAsRead(notificationId),
    }),
};
