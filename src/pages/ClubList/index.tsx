import { useEffect, useRef } from 'react';
import useScrollToTop from '@/utils/hooks/useScrollToTop';
import ClubCard from './components/ClubCard';
import SearchBar from './components/SearchBar';
import { useGetClubs } from './hooks/useGetClubs';

function ClubList() {
  useScrollToTop();
  const observerRef = useRef<HTMLDivElement>(null);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetClubs({ limit: 10 });

  const totalCount = data?.pages[0]?.totalCount ?? 0;
  const allClubs = data?.pages.flatMap((page) => page.clubs) ?? [];

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
    <div className="pb-15">
      <SearchBar isButton />
      <div className="bg-background mt-13 flex flex-col gap-2 px-3 pt-2 pb-4">
        <div className="text-[10px] leading-4 text-indigo-300">
          총 <span className="font-bold text-black">{totalCount}개</span>의 동아리
        </div>

        <div className="flex flex-col gap-2">
          {allClubs.map((club) => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>

        {hasNextPage && <div ref={observerRef} className="flex h-20 items-center justify-center" />}
      </div>
    </div>
  );
}

export default ClubList;
