import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { councilQueries } from '@/apis/council/queries';
import MegaphoneIcon from '@/assets/svg/megaphone.svg';
import { useInfiniteScroll } from '@/utils/hooks/useInfiniteScroll';

function CouncilNotice() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery(
    councilQueries.infiniteNotices(10)
  );
  const observerRef = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage);

  const allNotices = data?.pages.flatMap((page) => page.councilNotices) ?? [];
  const noticeListCardClassName = 'overflow-hidden rounded-2xl bg-white shadow-[0_0_20px_rgba(0,0,0,0.03)]';

  if (allNotices.length === 0) {
    return (
      <div className={`${noticeListCardClassName} px-5 py-16`}>
        <div className="flex flex-col items-center justify-center">
          <MegaphoneIcon className="mb-3 h-12 w-12 text-gray-300" />
          <div className="text-sm text-gray-500">등록된 공지사항이 없어요</div>
          <div className="mt-1 text-xs text-gray-400">새로운 공지사항이 등록되면 여기에 표시돼요</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={noticeListCardClassName}>
        {allNotices.map((notice) => (
          <Link to={`notice/${notice.id}`} key={notice.id} className="block bg-white px-5 py-4">
            <div className="flex items-center gap-1">
              <div className="text-text-700 min-w-0 text-[14px] leading-[1.6] font-semibold break-keep">
                {notice.title}
              </div>
              {!notice.isRead && <div className="h-1 w-1 shrink-0 rounded-full bg-[#8ED0E6]" />}
            </div>
            <div className="mt-2 text-[12px] leading-[1.6] text-indigo-300">{notice.createdAt}</div>
          </Link>
        ))}
      </div>
      {hasNextPage && <div ref={observerRef} className="h-px" />}
    </>
  );
}

export default CouncilNotice;
