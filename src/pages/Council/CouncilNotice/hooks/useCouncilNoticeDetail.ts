import { useEffect, useRef } from 'react';
import { useQueryClient, useSuspenseQuery, type InfiniteData } from '@tanstack/react-query';
import { authQueryKeys } from '@/apis/auth/queries';
import type { NoticeResponse } from '@/apis/council/entity';
import { councilQueries, councilQueryKeys } from '@/apis/council/queries';

interface UseGetCouncilNoticeDetailParams {
  noticeId: number;
}

export const useGetCouncilNoticeDetail = ({ noticeId }: UseGetCouncilNoticeDetailParams) => {
  const queryClient = useQueryClient();

  const query = useSuspenseQuery(councilQueries.noticeDetail(noticeId));

  const patchedRef = useRef<number | null>(null);

  useEffect(() => {
    if (!query.data) return;

    if (patchedRef.current === noticeId) return;
    patchedRef.current = noticeId;

    queryClient.setQueriesData<InfiniteData<NoticeResponse>>({ queryKey: councilQueryKeys.all }, (old) => {
      if (!old?.pages) return old;

      let changed = false;

      const next = {
        ...old,
        pages: old.pages.map((page) => {
          const nextNotices = page.councilNotices.map((n) => {
            if (n.id !== noticeId) return n;
            if (n.isRead) return n;
            changed = true;
            return { ...n, isRead: true };
          });

          return changed ? { ...page, councilNotices: nextNotices } : page;
        }),
      };

      return changed ? next : old;
    });

    queryClient.invalidateQueries({ queryKey: authQueryKeys.myInfo(), refetchType: 'all' });
  }, [noticeId, query.data, queryClient]);

  return query;
};
