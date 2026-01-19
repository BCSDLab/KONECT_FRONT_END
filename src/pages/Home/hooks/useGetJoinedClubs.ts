import { useSuspenseQuery } from '@tanstack/react-query';
import { getJoinedClubs } from '@/apis/club';
import { clubQueryKeys } from '@/pages/Club/ClubList/hooks/useGetClubs';

export const useGetJoinedClubs = () => {
  return useSuspenseQuery({
    queryKey: clubQueryKeys.joined(),
    queryFn: () => getJoinedClubs(),
  });
};
