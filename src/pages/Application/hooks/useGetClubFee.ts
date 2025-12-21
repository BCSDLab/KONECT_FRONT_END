import { useSuspenseQuery } from '@tanstack/react-query';
import { getClubFee } from '@/apis/club';

export const useGetClubFee = (clubId: number) => {
  return useSuspenseQuery({
    queryKey: ['clubFee', clubId],
    queryFn: () => getClubFee(clubId),
  });
};
