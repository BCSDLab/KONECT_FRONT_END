import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCouncilNotice } from '@/pages/ClubDetail/hooks/useCouncilNotices';

const isWithinThreeDays = (dateString: string): boolean => {
  const [year, month, day] = dateString.split('.').map(Number);
  const createdDate = new Date(year, month - 1, day);
  const today = new Date();
  const diffTime = today.getTime() - createdDate.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return diffDays <= 3 && diffDays >= 0;
};

function CouncilNotice() {
  const observerRef = useRef<HTMLDivElement>(null);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useCouncilNotice({ limit: 10 });

  const allNotices = data?.pages.flatMap((page) => page.councilNotices) ?? [];

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.3 }
    );

    const currentObserver = observerRef.current;
    if (currentObserver) {
      observer.observe(currentObserver);
    }

    return () => {
      if (currentObserver) {
        observer.unobserve(currentObserver);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

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
            {isWithinThreeDays(notice.createdAt) && <div className="h-1 w-1 rounded-full bg-[#ff4e4e]" />}
          </div>
          <div className="mt-2 text-xs leading-3.5 text-indigo-300">{notice.createdAt}</div>
        </Link>
      ))}
      {hasNextPage && <div ref={observerRef} className="flex h-20 items-center justify-center" />}
    </div>
  );
}

export default CouncilNotice;
