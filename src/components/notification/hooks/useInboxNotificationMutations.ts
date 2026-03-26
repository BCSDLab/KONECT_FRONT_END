import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationMutations } from '@/apis/notification/mutations';

export const useMarkInboxNotificationAsReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(notificationMutations.markInboxAsRead(queryClient));
};
