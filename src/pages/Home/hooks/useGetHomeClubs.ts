import { useSuspenseQueries } from '@tanstack/react-query';
import { clubQueries } from '@/apis/club/queries';

export const useGetHomeMyClubs = () => {
  return useSuspenseQueries({
    queries: [clubQueries.applied(), clubQueries.joined()],
    combine: ([appliedClubsQuery, joinedClubsQuery]) => ({
      appliedClubs: appliedClubsQuery.data.appliedClubs,
      joinedClubs: joinedClubsQuery.data.joinedClubs,
    }),
  });
};
