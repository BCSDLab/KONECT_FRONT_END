import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { cn } from '@konect/utils/cn';
import { useDebouncedCallback } from '@konect/utils/use-debounced-callback';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';

import { isClubCategory, type ClubCategory } from '@/apis/common/club';
import type { Region } from '@/apis/home/entity';
import type { UniversityClub, UniversityClubListRequestParams } from '@/apis/universityClub/entity';
import { universityClubQueries } from '@/apis/universityClub/queries';
import SearchIcon from '@/assets/svg/search-icon.svg';
import Breadcrumb from '@/components/Breadcrumb';
import UniversityClubSidebar from '@/components/UniversityClubSidebar';
import { CATEGORY_TEXT_COLORS } from '@/constants/club';
import useResetScroll from '@/utils/hooks/useResetScroll';

const PAGE_LIMIT = 12;
const HOME_UNIVERSITY_SECTION = 'universities';

function UniversityClubList() {
  const { universityId } = useParams();
  const parsedUniversityId = Number(universityId);

  if (!Number.isInteger(parsedUniversityId) || parsedUniversityId <= 0) {
    return <Navigate to="/" replace />;
  }

  return <UniversityClubListContent universityId={parsedUniversityId} />;
}

function UniversityClubListContent({ universityId }: { universityId: number }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = getCategoryParam(searchParams.get('category'));
  const query = searchParams.get('query')?.trim() ?? '';
  const [searchKeyword, setSearchKeyword] = useState(query);
  const observerRef = useRef<HTMLDivElement>(null);

  useResetScroll(universityId);

  const updateSearchQuery = useDebouncedCallback((value: string) => {
    updateListSearchParams(setSearchParams, { query: value.trim() });
  });

  const requestParams = useMemo(
    () =>
      ({
        limit: PAGE_LIMIT,
        ...(query ? { query } : {}),
        ...(selectedCategory ? { category: selectedCategory } : {}),
      }) satisfies UniversityClubListRequestParams,
    [query, selectedCategory]
  );

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useSuspenseInfiniteQuery(
    universityClubQueries.infiniteList(universityId, requestParams)
  );
  const [{ university, categories }] = data.pages;
  const clubs = data.pages.flatMap((pageData) => pageData.clubs);

  const handleSearchKeywordChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchKeyword(value);
    updateSearchQuery(value);
  };

  const handleCategoryChange = (category?: ClubCategory) => {
    updateListSearchParams(setSearchParams, { category });
  };

  useEffect(() => {
    setSearchKeyword(query);
  }, [query]);

  useEffect(() => {
    const target = observerRef.current;

    if (!target || !hasNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: '240px 0px' }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <main className="min-h-screen text-black">
      <div className="mx-auto mt-12 flex w-full max-w-278 flex-col px-5 pb-20 md:px-0 lg:mt-25">
        <Breadcrumb
          items={[
            { label: '홈', to: '/' },
            { label: university.regionName, to: getHomeUniversitySectionPath(university.region) },
            { label: university.name },
          ]}
        />

        <div className="mt-10 grid gap-8 md:grid-cols-[296px_minmax(0,1050px)] lg:mt-15 lg:gap-5">
          <UniversityClubSidebar university={university} clubCount={university.clubCount} />

          <section className="flex min-w-0 flex-col items-center gap-10">
            <div className="flex w-full flex-col gap-5">
              <label className="border-text-100 focus-within:border-primary-500 flex items-center rounded-[30px] border bg-white px-5 transition-[border-color,box-shadow] focus-within:shadow-[0_0_30px_0_rgba(105,191,223,0.18)] sm:px-8 sm:py-3.5">
                <span className="sr-only">동아리명 검색</span>
                <input
                  className="placeholder:text-text-300 text-text-700 min-w-0 flex-1 bg-transparent text-base leading-10 font-medium outline-none sm:text-[24px]"
                  value={searchKeyword}
                  onChange={handleSearchKeywordChange}
                  placeholder="동아리명을 검색해 보세요"
                />
                <SearchIcon className="h-8 sm:h-10" />
              </label>

              <div className="flex min-w-0 gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <CategoryFilterButton
                  label="전체"
                  count={university.clubCount}
                  isSelected={!selectedCategory}
                  onClick={() => handleCategoryChange()}
                />
                {categories.map((category) => (
                  <CategoryFilterButton
                    key={category.category}
                    label={category.categoryName}
                    count={category.count}
                    isSelected={category.category === selectedCategory}
                    onClick={() => handleCategoryChange(category.category)}
                  />
                ))}
              </div>
            </div>

            <div className="flex w-full flex-col gap-5">
              <p className="text-text-400 text-[16px] leading-7">
                선택한 대학의 동아리를 확인해보세요. 관심 있는 동아리의 소개를 살펴볼 수 있어요.
              </p>

              {clubs.length > 0 ? (
                <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
                  {clubs.map((club) => (
                    <ClubCard key={club.id} club={club} />
                  ))}
                </div>
              ) : (
                <ClubListMessage message="검색 조건에 맞는 동아리가 없어요." />
              )}

              {hasNextPage && (
                <div
                  ref={observerRef}
                  className="text-text-400 flex h-20 items-center justify-center text-[16px] leading-7"
                  aria-live="polite"
                >
                  {isFetchingNextPage ? '동아리를 불러오는 중이에요.' : null}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function ClubCard({ club }: { club: UniversityClub }) {
  return (
    <Link
      className="border-text-100 hover:border-primary-500 focus-visible:outline-primary-500 flex items-center gap-5 overflow-hidden rounded-[20px] border bg-white px-5.5 py-5 text-left transition-colors hover:shadow-[0_0_30px_0_rgba(105,191,223,0.18)] focus-visible:outline-2 focus-visible:outline-offset-2"
      type="button"
      to={`/clubs/${club.id}`}
    >
      <img className="size-12.5 shrink-0 object-contain" src={club.imageUrl} alt="" />
      <span className="min-w-0">
        <span className={cn('block truncate text-[18px] leading-10 font-semibold text-black')}>{club.name}</span>
        <span className="flex min-w-0 items-center gap-2 leading-10">
          <span className={cn('shrink-0 font-semibold', CATEGORY_TEXT_COLORS[club.category])}>{club.categoryName}</span>
          <span className="bg-text-200 size-1.5 shrink-0 rounded-full" aria-hidden="true" />
          <span className={cn('text-text-600 min-w-0 truncate font-medium')}>{club.topic}</span>
        </span>
      </span>
    </Link>
  );
}

function CategoryFilterButton({
  label,
  count,
  isSelected,
  onClick,
}: {
  label: string;
  count: number;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={cn(
        'focus-visible:outline-primary-500 flex shrink-0 items-center justify-center rounded-[26px] px-5 leading-10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2',
        isSelected
          ? 'border-primary-500 text-primary-500 border bg-white font-medium'
          : 'text-text-300 hover:text-text-600'
      )}
      type="button"
      aria-pressed={isSelected}
      onClick={onClick}
    >
      <span className={cn(isSelected ? 'font-medium' : 'text-text-500 font-semibold')}>{label}</span>
      <span className={cn('ml-1', isSelected ? 'font-semibold' : 'font-normal')}>{count}</span>
    </button>
  );
}

function ClubListMessage({ message }: { message: string }) {
  return (
    <div className="border-text-100 text-text-500 flex h-35 w-full items-center justify-center rounded-[20px] border bg-white text-center text-[18px] leading-8">
      {message}
    </div>
  );
}

function getCategoryParam(value: string | null): ClubCategory | undefined {
  if (isClubCategory(value)) {
    return value;
  }

  return undefined;
}

function getHomeUniversitySectionPath(region: Region) {
  const params = new URLSearchParams({ section: HOME_UNIVERSITY_SECTION });

  if (region !== 'UNKNOWN') {
    params.set('region', region);
  }

  return `/?${params.toString()}`;
}

function updateListSearchParams(
  setSearchParams: ReturnType<typeof useSearchParams>[1],
  next: { query?: string; category?: ClubCategory }
) {
  setSearchParams((prev) => {
    const params = new URLSearchParams(prev);

    if ('query' in next) {
      if (next.query) params.set('query', next.query);
      else params.delete('query');
    }

    if ('category' in next) {
      if (next.category) params.set('category', next.category);
      else params.delete('category');
    }
    return params;
  });
}

export default UniversityClubList;
