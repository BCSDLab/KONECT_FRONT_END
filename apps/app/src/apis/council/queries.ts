import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import type { NoticeResponse } from './entity';
import { getCouncilInfo, getCouncilNotice, getCouncilNoticeDetail } from '.';

export const councilQueryKeys = {
  all: ['council'] as const,
  info: () => [...councilQueryKeys.all, 'info'] as const,
  notices: (limit: number) => [...councilQueryKeys.all, 'notices', limit] as const,
  noticesPreview: (limit: number) => [...councilQueryKeys.all, 'noticesPreview', limit] as const,
  noticeDetail: (noticeId: number) => [...councilQueryKeys.all, 'noticeDetail', noticeId] as const,
};

export const councilQueries = {
  info: () =>
    queryOptions({
      queryKey: councilQueryKeys.info(),
      queryFn: getCouncilInfo,
    }),
  noticesPreview: (limit = 3) =>
    queryOptions({
      queryKey: councilQueryKeys.noticesPreview(limit),
      queryFn: () => getCouncilNotice({ page: 1, limit }),
    }),
  noticeDetail: (noticeId: number) =>
    queryOptions({
      queryKey: councilQueryKeys.noticeDetail(noticeId),
      queryFn: () => getCouncilNoticeDetail(noticeId),
    }),
  infiniteNotices: (limit = 10) =>
    infiniteQueryOptions({
      queryKey: councilQueryKeys.notices(limit),
      queryFn: ({ pageParam }) => getCouncilNotice({ page: pageParam, limit }),
      initialPageParam: 1,
      getNextPageParam: (lastPage: NoticeResponse) => {
        if (lastPage.currentPage >= lastPage.totalPage) {
          return undefined;
        }

        return lastPage.currentPage + 1;
      },
    }),
};
