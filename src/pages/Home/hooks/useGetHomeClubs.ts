import { useSuspenseInfiniteQuery, useSuspenseQueries } from '@tanstack/react-query';
import { getAppliedClubs, getClubs, getJoinedClubs } from '@/apis/club';
import type { ClubResponse } from '@/apis/club/entity';
import { clubQueryKeys } from '@/apis/club/queries';

interface UseGetHomeRecruitingClubsParams {
  limit?: number;
}

export const useGetHomeMyClubs = () => {
  return useSuspenseQueries({
    queries: [
      {
        queryKey: clubQueryKeys.applied(),
        queryFn: () => getAppliedClubs(),
      },
      {
        queryKey: clubQueryKeys.joined(),
        queryFn: () => getJoinedClubs(),
      },
    ],
    combine: ([appliedClubsQuery, joinedClubsQuery]) => ({
      appliedClubs: appliedClubsQuery.data.appliedClubs,
      joinedClubs: joinedClubsQuery.data.joinedClubs,
    }),
  });
};

export const useGetHomeRecruitingClubs = ({ limit = 10 }: UseGetHomeRecruitingClubsParams = {}) => {
  return useSuspenseInfiniteQuery({
    queryKey: clubQueryKeys.infinite.list({ limit, isRecruiting: true }),
    queryFn: ({ pageParam = 1 }) =>
      getClubs({
        page: pageParam,
        limit,
        isRecruiting: true,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: ClubResponse) => {
      if (lastPage.currentPage < lastPage.totalPage) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
  });
};
