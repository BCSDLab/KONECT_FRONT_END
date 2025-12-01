import { useInfiniteQuery } from '@tanstack/react-query';
import { getClubs } from '@/apis/club';
import type { ClubResponse } from '@/apis/club/entity';

interface UseGetClubsParams {
  limit?: number;
  query?: string;
  enabled?: boolean;
}

export const useGetClubs = ({ limit = 10, query, enabled = true }: UseGetClubsParams = {}) => {
  return useInfiniteQuery({
    queryKey: ['clubs', limit, query],
    queryFn: ({ pageParam = 1 }) => getClubs({ page: pageParam, limit, ...(query ? { query } : {}) }),
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
