import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getClubs, getAppliedClubs, getJoinedClubs } from '@/apis/club';
import type { ClubResponse } from '@/apis/club/entity';

export const clubQueryKeys = {
  all: ['clubs'],
  list: (params: { limit: number; query?: string; isRecruiting: boolean }) => [
    ...clubQueryKeys.all,
    'list',
    params.limit,
    params.query,
    params.isRecruiting,
  ],
  detail: (clubId: number) => [...clubQueryKeys.all, 'detail', clubId],
  members: (clubId: number) => [...clubQueryKeys.all, 'members', clubId],
  recruitment: (clubId: number) => [...clubQueryKeys.all, 'recruitment', clubId],
  fee: (clubId: number) => [...clubQueryKeys.all, 'fee', clubId],
  questions: (clubId: number) => [...clubQueryKeys.all, 'questions', clubId],
  joined: () => [...clubQueryKeys.all, 'joined'],
  applied: () => [...clubQueryKeys.all, 'applied'],
};

interface UseGetClubsParams {
  limit?: number;
  query?: string;
  enabled?: boolean;
  isRecruiting?: boolean;
}

export const useGetClubs = ({ limit = 10, query, enabled = true, isRecruiting = false }: UseGetClubsParams = {}) => {
  return useInfiniteQuery({
    queryKey: clubQueryKeys.list({ limit, query, isRecruiting }),
    queryFn: ({ pageParam = 1 }) =>
      getClubs({
        page: pageParam,
        limit,
        ...(query ? { query } : {}),
        isRecruiting,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: ClubResponse) => {
      if (lastPage.currentPage < lastPage.totalPage) {
        return lastPage.currentPage + 1;
      }
      return undefined;
    },
    getPreviousPageParam: (firstPage: ClubResponse) => {
      return firstPage.currentPage > 1 ? firstPage.currentPage - 1 : undefined;
    },
    enabled,
  });
};

export const useGetAppliedClubs = () => {
  return useQuery({
    queryKey: clubQueryKeys.applied(),
    queryFn: getAppliedClubs,
  });
};

export const useGetJoinedClubs = () => {
  return useQuery({
    queryKey: clubQueryKeys.joined(),
    queryFn: getJoinedClubs,
  });
};
