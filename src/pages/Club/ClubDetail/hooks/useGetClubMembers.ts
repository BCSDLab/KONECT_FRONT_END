import { useQuery } from '@tanstack/react-query';
import { getClubMembers } from '@/apis/club';
import { clubQueryKeys } from '@/apis/club/queries';

export const useGetClubMembers = (clubId?: number) => {
  return useQuery({
    queryKey: clubId ? clubQueryKeys.members(clubId) : ['clubMembers', 'disabled'],
    queryFn: () => getClubMembers(clubId!),
    enabled: !!clubId,
  });
};
