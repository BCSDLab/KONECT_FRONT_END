import { useSuspenseQuery } from '@tanstack/react-query';
import { getAppliedClubs } from '@/apis/club';
import { clubQueryKeys } from '@/pages/Club/ClubList/hooks/useGetClubs';

export const useGetAppliedClubs = () => {
  return useSuspenseQuery({
    queryKey: clubQueryKeys.applied(),
    queryFn: () => getAppliedClubs(),
  });
};
