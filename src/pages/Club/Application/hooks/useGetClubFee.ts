import { useSuspenseQuery } from '@tanstack/react-query';
import { getClubFee } from '@/apis/club';
import { clubQueryKeys } from '@/apis/club/queries';

export const useGetClubFee = (clubId: number) => {
  return useSuspenseQuery({
    queryKey: clubQueryKeys.fee(clubId),
    queryFn: () => getClubFee(clubId),
  });
};
