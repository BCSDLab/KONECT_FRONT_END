import { useSuspenseQuery } from '@tanstack/react-query';
import { getClubDetail } from '@/apis/club';

export const useGetClubDetail = (clubId: number) => {
  return useSuspenseQuery({
    queryKey: ['clubDetail', clubId],
    queryFn: () => getClubDetail(clubId),
  });
};
