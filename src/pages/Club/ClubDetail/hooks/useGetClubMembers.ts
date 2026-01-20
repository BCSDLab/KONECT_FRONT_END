import { useSuspenseQuery } from '@tanstack/react-query';
import { getClubMembers } from '@/apis/club';
import { clubQueryKeys } from '@/pages/Club/ClubList/hooks/useGetClubs';

export const useGetClubMembers = (clubId: number) => {
  return useSuspenseQuery({
    queryKey: clubQueryKeys.members(clubId),
    queryFn: () => getClubMembers(clubId),
  });
};
