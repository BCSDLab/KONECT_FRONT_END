import { useEffect, useRef } from 'react';
import { useQueryClient, useSuspenseQuery, type InfiniteData } from '@tanstack/react-query';
import { getCouncilNoticeDetail } from '@/apis/council';
import type { NoticeResponse } from '@/apis/council/entity';

interface UseGetCouncilNoticeDetailParams {
  noticeId: number;
}

export const useGetCouncilNoticeDetail = ({ noticeId }: UseGetCouncilNoticeDetailParams) => {
  const queryClient = useQueryClient();

  const query = useSuspenseQuery({
    queryKey: ['councilNoticeDetail', noticeId],
    queryFn: () => getCouncilNoticeDetail(noticeId),
  });

  const patchedRef = useRef<number | null>(null);

  useEffect(() => {
    if (!query.data) return;

    if (patchedRef.current === noticeId) return;
    patchedRef.current = noticeId;

    queryClient.setQueriesData<InfiniteData<NoticeResponse>>({ queryKey: ['councilNotice'] }, (old) => {
      if (!old) return old;

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
  }, [noticeId, query.data, queryClient]);

  return query;
};
