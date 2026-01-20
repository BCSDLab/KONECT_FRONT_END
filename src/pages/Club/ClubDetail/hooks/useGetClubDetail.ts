import { useSuspenseQuery } from '@tanstack/react-query';
import { getClubDetail } from '@/apis/club';
import { clubQueryKeys } from '@/pages/Club/ClubList/hooks/useGetClubs';

export const useGetClubDetail = (clubId: number) => {
  return useSuspenseQuery({
    queryKey: clubQueryKeys.detail(clubId),
    queryFn: () => getClubDetail(clubId),
  });
};
