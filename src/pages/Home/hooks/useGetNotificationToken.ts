import { useQuery } from '@tanstack/react-query';
import { getNotificationToken } from '@/apis/notification';

export const useGetNotificationToken = () => {
  return useQuery({
    queryKey: ['notification', 'token'],
    queryFn: () => getNotificationToken(),
    retry: false,
  });
};
