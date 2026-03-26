import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { councilQueries } from '@/apis/council/queries';

interface UseCouncilNoticeParams {
  limit?: number;
}

export const useCouncilNotice = ({ limit = 10 }: UseCouncilNoticeParams = {}) => {
  return useSuspenseInfiniteQuery(councilQueries.infiniteNotices(limit));
};
