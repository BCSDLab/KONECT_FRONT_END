import { useSuspenseInfiniteQuery, useSuspenseQueries } from '@tanstack/react-query';
import { clubQueries } from '@/apis/club/queries';

interface UseGetHomeRecruitingClubsParams {
  limit?: number;
}

export const useGetHomeMyClubs = () => {
  return useSuspenseQueries({
    queries: [clubQueries.applied(), clubQueries.joined()],
    combine: ([appliedClubsQuery, joinedClubsQuery]) => ({
      appliedClubs: appliedClubsQuery.data.appliedClubs,
      joinedClubs: joinedClubsQuery.data.joinedClubs,
    }),
  });
};

export const useGetHomeRecruitingClubs = ({ limit = 10 }: UseGetHomeRecruitingClubsParams = {}) => {
  return useSuspenseInfiniteQuery(clubQueries.infiniteList({ limit, isRecruiting: true }));
};
