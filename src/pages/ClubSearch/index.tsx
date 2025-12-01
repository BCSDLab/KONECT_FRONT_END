import { type FormEvent, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ClubCard from '../ClubList/components/ClubCard';
import SearchBar from '../ClubList/components/SearchBar';
import { useGetClubs } from '../ClubList/hooks/useGetClubs';

function ClubSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('query') ?? '';

  const [keyword, setKeyword] = useState(initialQuery);
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery);

  const observerRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useGetClubs({
    limit: 10,
    query: submittedQuery || undefined,
    enabled: !!submittedQuery,
  });

  const totalCount = data?.pages[0]?.totalCount ?? 0;
  const allClubs = data?.pages.flatMap((page) => page.clubs) ?? [];

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmed = keyword.trim();

    if (trimmed) {
      setSearchParams({ query: trimmed }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }

    setSubmittedQuery(trimmed);
  };

  useEffect(() => {
    if (!submittedQuery || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.3 }
    );

    const currentObserver = observerRef.current;
    if (currentObserver) observer.observe(currentObserver);

    return () => {
      if (currentObserver) observer.unobserve(currentObserver);
    };
  }, [submittedQuery, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-[#fcfcfc]">
      <SearchBar value={keyword} onChange={setKeyword} onSubmit={handleSubmit} />

      <div className="mt-13 flex flex-col gap-2 px-3 pt-2 pb-4">
        {!submittedQuery ? (
          <div className="py-6 text-center text-xs text-indigo-300">검색어를 입력해서 동아리를 검색해보세요.</div>
        ) : (
          <>
            <div className="text-[10px] leading-4 text-indigo-300">
              총 <span className="font-bold text-black">{totalCount}개</span>의 동아리
            </div>

            <div className="flex flex-col gap-2">
              {allClubs.map((club) => (
                <ClubCard key={club.id} club={club} />
              ))}

              {submittedQuery && !allClubs.length && (
                <div className="py-8 text-center text-xs text-indigo-300">
                  {submittedQuery}에 해당하는 동아리가 없습니다.
                </div>
              )}
            </div>

            {hasNextPage && <div ref={observerRef} className="flex h-20 items-center justify-center" />}
          </>
        )}
      </div>
    </div>
  );
}

export default ClubSearch;
