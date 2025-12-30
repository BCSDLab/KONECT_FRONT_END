import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { getCouncilNotice } from '@/apis/council';

interface UseCouncilNoticeParams {
  limit?: number;
}

export const useCouncilNotice = ({ limit = 10 }: UseCouncilNoticeParams = {}) => {
  return useSuspenseInfiniteQuery({
    queryKey: ['councilNotice', limit],
    queryFn: ({ pageParam }) => getCouncilNotice({ page: pageParam, limit }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage >= lastPage.totalPage) {
        return undefined;
      }
      return lastPage.currentPage + 1;
    },
  });
};
