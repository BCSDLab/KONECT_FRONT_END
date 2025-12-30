import { useSuspenseQuery } from '@tanstack/react-query';
import { getClubMembers } from '@/apis/club';

export const useGetClubMembers = (clubId: number) => {
  return useSuspenseQuery({
    queryKey: ['clubMembers', clubId],
    queryFn: () => getClubMembers(clubId),
  });
};
