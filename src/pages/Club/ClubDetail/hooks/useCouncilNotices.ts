import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { getCouncilNotice } from '@/apis/council';
import { councilQueryKeys } from '@/pages/Council/CouncilDetail/hooks/useGetCouncilInfo';

interface UseCouncilNoticeParams {
  limit?: number;
}

export const useCouncilNotice = ({ limit = 10 }: UseCouncilNoticeParams = {}) => {
  return useSuspenseInfiniteQuery({
    queryKey: councilQueryKeys.notices(limit),
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
