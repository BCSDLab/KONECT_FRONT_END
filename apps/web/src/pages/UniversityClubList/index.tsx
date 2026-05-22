import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { cn } from '@konect/utils/cn';
import { useDebouncedCallback } from '@konect/utils/use-debounced-callback';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';

import type { ClubCategory, UniversityClub, UniversityClubListRequestParams } from '@/apis/universityClub/entity';
import { universityClubQueries } from '@/apis/universityClub/queries';
import SearchIcon from '@/assets/svg/search-icon.svg';
import { CATEGORY_TEXT_COLORS } from '@/constants/club';

const PAGE_LIMIT = 12;

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
  const firstPage = data.pages[0];
  const { university, totalCount, categories } = firstPage;
  const clubs = data.pages.flatMap((pageData) => pageData.clubs);
  const universityLabel = university.campusName ? `${university.name} ${university.campusName}` : university.name;
  const categoryTotalCount = categories.reduce((sum, category) => sum + category.count, 0);
  const allClubCount = categoryTotalCount || totalCount;
  const recentClubs = clubs.slice(0, 4);

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

  const handleSearchKeywordChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchKeyword(value);
    updateSearchQuery(value);
  };

  const handleCategoryChange = (category?: ClubCategory) => {
    updateListSearchParams(setSearchParams, { category });
  };

  return (
    <main className="bg-web-background min-h-screen text-black">
      <div className="mx-auto flex w-full max-w-369.5 flex-col px-5 pt-12 pb-20 sm:px-8 lg:pt-25.5 xl:px-0">
        <nav className="text-text-400 flex items-center gap-3 text-sm leading-8 font-semibold sm:gap-3.5 sm:text-[24px] sm:leading-10">
          <Link className="hover:text-primary-600 transition-colors" to="/">
            홈
          </Link>
          <span className="text-text-300 text-lg sm:text-[20px]" aria-hidden="true">
            ›
          </span>
          <span>{university.regionName}</span>
          <span className="text-text-300 text-lg sm:text-[20px]" aria-hidden="true">
            ›
          </span>
          <span className="text-text-600 min-w-0 truncate">{university.name}</span>
        </nav>

        <div className="mt-10 grid gap-8 lg:mt-15 lg:grid-cols-[407px_minmax(0,1050px)] lg:gap-5">
          <aside className="flex flex-col gap-6 lg:gap-10">
            <section className="border-text-100 flex h-55 items-center justify-center rounded-4xl border bg-white px-8 py-8 text-center sm:h-66 sm:rounded-[40px] sm:px-21 sm:py-10">
              <div className="flex min-w-0 flex-col items-center gap-3">
                <img className="h-22 w-17.5 object-contain" src={university.imageUrl} alt="" />
                <div className="flex max-w-full flex-col items-center leading-10">
                  <h1 className="max-w-full truncate text-[24px] font-semibold text-black">{universityLabel}</h1>
                  <p className="text-text-400 text-[20px]">{allClubCount}개 동아리</p>
                </div>
              </div>
            </section>

            <section className="border-text-100 rounded-4xl border bg-white px-5 py-7 sm:rounded-[40px] sm:px-10 sm:py-11">
              <h2 className="text-text-600 text-[24px] leading-10 font-medium">최근에 본 동아리</h2>
              <div className="mt-10 flex flex-col gap-5">
                {recentClubs.length > 0 ? (
                  recentClubs.map((club) => <RecentClubCard key={club.id} club={club} />)
                ) : (
                  <p className="border-primary-200 text-text-400 bg-web-background rounded-[20px] border px-6 py-8 text-center text-[16px] leading-7">
                    표시할 동아리가 없어요.
                  </p>
                )}
              </div>
            </section>
          </aside>

          <section className="flex min-w-0 flex-col items-center gap-10">
            <div className="flex w-full flex-col gap-5">
              <label className="border-text-100 focus-within:border-primary-500 flex h-18 items-center rounded-[30px] border bg-white px-6 transition-[border-color,box-shadow] focus-within:shadow-[0_0_30px_0_rgba(105,191,223,0.18)] sm:h-21 sm:px-8">
                <span className="sr-only">동아리명 검색</span>
                <input
                  className="placeholder:text-text-300 text-text-700 min-w-0 flex-1 bg-transparent text-base leading-10 font-medium outline-none sm:text-[24px]"
                  value={searchKeyword}
                  onChange={handleSearchKeywordChange}
                  placeholder="동아리명을 검색해 보세요"
                />
                <SearchIcon className="h-8 shrink-0 sm:h-10" />
              </label>

              <div className="border-text-100 flex h-19.5 items-center overflow-hidden rounded-[30px] border px-4 py-1.5 sm:px-8">
                <div className="flex min-w-0 gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <CategoryFilterButton
                    label="전체"
                    count={allClubCount}
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
            </div>

            <div className="flex w-full flex-col gap-5">
              <p className="text-text-400 text-[16px] leading-7 sm:text-[20px]">
                선택한 대학의 동아리를 확인해보세요. 관심 있는 동아리의 소개를 살펴볼 수 있어요.
              </p>

              {clubs.length > 0 ? (
                <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
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

function RecentClubCard({ club }: { club: UniversityClub }) {
  const navigate = useNavigate();
  return (
    <button
      className="border-primary-200 bg-web-background hover:border-primary-500 focus-visible:outline-primary-500 flex h-30.5 max-h-30.5 min-h-30.5 w-full shrink-0 items-center gap-7 overflow-hidden rounded-[20px] border px-7.5 py-6.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
      type="button"
      onClick={() => navigate(`/clubs/${club.id}`)}
    >
      <ClubImage className="size-17.5" imageUrl={club.imageUrl} name={club.name} />
      <ClubMeta
        club={club}
        titleClassName="w-57 text-[20px]"
        categoryClassName="text-[16px]"
        descriptionClassName="text-[16px]"
      />
    </button>
  );
}

function ClubCard({ club }: { club: UniversityClub }) {
  const navigate = useNavigate();
  return (
    <button
      className="border-text-100 hover:border-primary-500 focus-visible:outline-primary-500 flex h-35 items-center gap-5 overflow-hidden rounded-[20px] border bg-white px-5.5 py-8 text-left transition-colors hover:shadow-[0_0_30px_0_rgba(105,191,223,0.18)] focus-visible:outline-2 focus-visible:outline-offset-2"
      type="button"
      onClick={() => navigate(`/clubs/${club.id}`)}
    >
      <ClubImage className="size-12.5" imageUrl={club.imageUrl} name={club.name} />
      <ClubMeta
        club={club}
        titleClassName="w-57 text-[20px]"
        categoryClassName="text-[14px]"
        descriptionClassName="text-[14px]"
      />
    </button>
  );
}

function ClubImage({ className, imageUrl, name }: { className: string; imageUrl?: string; name: string }) {
  if (imageUrl) {
    return <img className={cn('shrink-0 object-contain', className)} src={imageUrl} alt="" />;
  }

  return (
    <span className={cn('bg-primary-100 border-primary-200 block shrink-0 rounded-full border', className)}>
      <span className="sr-only">{name}</span>
    </span>
  );
}

function ClubMeta({
  club,
  titleClassName,
  categoryClassName,
  descriptionClassName,
}: {
  club: UniversityClub;
  titleClassName: string;
  categoryClassName: string;
  descriptionClassName: string;
}) {
  return (
    <span className="min-w-0">
      <span className={cn('block truncate leading-10 font-semibold text-black', titleClassName)}>{club.name}</span>
      <span className="flex min-w-0 items-center gap-2 leading-10">
        <span className={cn('shrink-0 font-semibold', CATEGORY_TEXT_COLORS[club.category], categoryClassName)}>
          {club.categoryName}
        </span>
        <span className="bg-text-200 size-1.5 shrink-0 rounded-full" aria-hidden="true" />
        <span className={cn('text-text-600 min-w-0 truncate font-medium', descriptionClassName)}>
          {club.description || `${club.memberCount}명`}
        </span>
      </span>
    </span>
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
        'focus-visible:outline-primary-500 flex h-14 shrink-0 items-center justify-center rounded-[26px] px-5 py-1.5 text-[20px] leading-10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2',
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
  if (
    value === 'ACADEMIC' ||
    value === 'SPORTS' ||
    value === 'HOBBY' ||
    value === 'RELIGION' ||
    value === 'PERFORMANCE' ||
    value === 'JUNIOR'
  ) {
    return value;
  }

  return undefined;
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
