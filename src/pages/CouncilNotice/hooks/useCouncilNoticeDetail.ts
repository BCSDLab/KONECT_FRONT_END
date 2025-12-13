import { useSuspenseQuery } from '@tanstack/react-query';
import { getCouncilNoticeDetail } from '@/apis/council';

interface UseGetCouncilNoticeDetailParams {
  noticeId: number;
}

export const useGetCouncilNoticeDetail = ({ noticeId }: UseGetCouncilNoticeDetailParams) => {
  return useSuspenseQuery({
    queryKey: ['councilNoticeDetail', noticeId],
    queryFn: () => getCouncilNoticeDetail(noticeId),
  });
};
