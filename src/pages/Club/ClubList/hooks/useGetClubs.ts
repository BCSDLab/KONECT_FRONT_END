import { useInfiniteQuery } from '@tanstack/react-query';
import type { ClubResponse } from '@/apis/club/entity';
import { clubQueries } from '@/apis/club/queries';

interface UseGetClubsParams {
  limit?: number;
  query?: string;
  enabled?: boolean;
  isRecruiting?: boolean;
}

export const useGetClubs = ({ limit = 10, query, enabled = true, isRecruiting = false }: UseGetClubsParams = {}) => {
  return useInfiniteQuery({
    ...clubQueries.infiniteList({ limit, query, isRecruiting }),
    getPreviousPageParam: (firstPage: ClubResponse) => {
      return firstPage.currentPage > 1 ? firstPage.currentPage - 1 : undefined;
    },
    enabled,
  });
};
