import { useSuspenseQuery } from '@tanstack/react-query';
import { getCouncilNotice } from '@/apis/council';

interface UseCouncilNoticeParams {
  page?: number;
  limit?: number;
}

export const useCouncilNotice = ({ page = 1, limit = 10 }: UseCouncilNoticeParams = {}) => {
  return useSuspenseQuery({
    queryKey: ['councilNotice', page, limit],
    queryFn: () => getCouncilNotice({ page, limit }),
  });
};
