import { Link } from 'react-router-dom';
import { useCouncilNotice } from '@/pages/Club/ClubDetail/hooks/useCouncilNotices';
import { useInfiniteScroll } from '@/utils/hooks/useInfiniteScroll';

function CouncilNotice() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useCouncilNotice({ limit: 10 });
  const observerRef = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage);

  const allNotices = data?.pages.flatMap((page) => page.councilNotices) ?? [];

  return (
    <div className="mt-31.5">
      {allNotices.map((notice) => (
        <Link
          to={`notice/${notice.id}`}
          key={notice.id}
          className="bg-indigo-0 border-indigo-5 block border-b px-5 py-4"
        >
          <div className="flex items-center gap-1">
            <div className="text-[13px] leading-[15px] font-semibold text-indigo-700">{notice.title}</div>
            {!notice.isRead && <div className="h-1 w-1 rounded-full bg-[#ff4e4e]" />}
          </div>
          <div className="mt-2 text-xs leading-3.5 text-indigo-300">{notice.createdAt}</div>
        </Link>
      ))}
      {hasNextPage && <div ref={observerRef} className="flex h-20 items-center justify-center" />}
    </div>
  );
}

export default CouncilNotice;
