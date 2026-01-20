import { useSuspenseQuery } from '@tanstack/react-query';
import { getCouncilInfo } from '@/apis/council';

export const councilQueryKeys = {
  all: ['council'],
  info: () => [...councilQueryKeys.all, 'info'],
  notices: (limit: number) => [...councilQueryKeys.all, 'notices', limit],
  noticeDetail: (noticeId: number) => [...councilQueryKeys.all, 'noticeDetail', noticeId],
};

export const useGetCouncilInfo = () => {
  return useSuspenseQuery({
    queryKey: councilQueryKeys.info(),
    queryFn: () => getCouncilInfo(),
  });
};
