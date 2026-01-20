import { useSuspenseQuery } from '@tanstack/react-query';
import { getClubFee } from '@/apis/club';
import { clubQueryKeys } from '@/pages/Club/ClubList/hooks/useGetClubs';

export const useGetClubFee = (clubId: number) => {
  return useSuspenseQuery({
    queryKey: clubQueryKeys.fee(clubId),
    queryFn: () => getClubFee(clubId),
  });
};
