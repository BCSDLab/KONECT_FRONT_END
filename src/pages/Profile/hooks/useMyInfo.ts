import { useSuspenseQuery } from '@tanstack/react-query';
import { getMyInfo } from '@/apis/auth';

export const useGetMyInfo = () => {
  return useSuspenseQuery({
    queryKey: ['myInfo'],
    queryFn: () => getMyInfo(),
  });
};
