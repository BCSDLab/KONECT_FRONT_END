import { useSuspenseQuery } from '@tanstack/react-query';
import { getJoinedClubs } from '@/apis/club';

export const useGetJoinedClubs = () => {
  return useSuspenseQuery({
    queryKey: ['joinedClubs'],
    queryFn: () => getJoinedClubs(),
  });
};
