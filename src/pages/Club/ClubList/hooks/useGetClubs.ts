import { useInfiniteQuery } from '@tanstack/react-query';
import { getClubs } from '@/apis/club';
import type { ClubResponse } from '@/apis/club/entity';

interface UseGetClubsParams {
  limit?: number;
  query?: string;
  enabled?: boolean;
  isRecruiting?: boolean;
}

export const useGetClubs = ({ limit = 10, query, enabled = true, isRecruiting = false }: UseGetClubsParams = {}) => {
  return useInfiniteQuery({
    queryKey: ['clubs', limit, query, isRecruiting],
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
