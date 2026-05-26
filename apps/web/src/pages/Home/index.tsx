import { useState, type ChangeEvent } from 'react';
import { useDebouncedCallback } from '@konect/utils/use-debounced-callback';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

import type { Region, HomeRequestParams, University } from '@/apis/home/entity';
import { homeQueries } from '@/apis/home/queries';
import heroCatBook from '@/assets/hero-cat-book.png';
import SearchIcon from '@/assets/svg/search-icon.svg';
import RecentClubList from '@/components/RecentClubList';

const REGION_OPTIONS: { label: string; value?: Region }[] = [
  { label: '전체' },
  { label: '서울', value: 'SEOUL' },
  { label: '경기도', value: 'GYEONGGI' },
  { label: '충청도', value: 'CHUNGCHEONG' },
  { label: '전라도', value: 'JEOLLA' },
  { label: '경상도', value: 'GYEONGSANG' },
  { label: '강원도', value: 'GANGWON' },
  { label: '제주도', value: 'JEJU' },
];

function Home() {
  const [selectedRegion, setSelectedRegion] = useState<Region>();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const updateSearchQuery = useDebouncedCallback((value: string) => {
    setSearchQuery(value.trim());
  });

  const homeParams = {
    ...(searchQuery ? { query: searchQuery } : {}),
    ...(selectedRegion ? { region: selectedRegion } : {}),
  } satisfies HomeRequestParams;

  const { data: homeData } = useSuspenseQuery(homeQueries.detail(homeParams));
  const universities = homeData.universities ?? [];
  const totalUniversityCount = homeData.totalUniversityCount;
  const isSearching = searchKeyword.trim().length > 0 || searchQuery.length > 0;

  const handleSearchKeywordChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchKeyword(value);
    updateSearchQuery(value);
  };

  return (
    <div className="min-h-screen text-black">
      <main className="mx-auto flex w-full max-w-264 flex-col items-center pt-16 pb-24 sm:pt-24 lg:pt-34">
        <section className="relative flex w-full flex-col items-center text-center">
          <div className="border-primary-400 bg-primary-100 text-primary-500 rounded-full border px-5 py-1 leading-10 font-semibold">
            전국 대학 동아리를 한 곳에서
          </div>
          <div className="mt-5 w-full">
            <h1 className="text-[30px] leading-[1.3] font-extrabold text-black md:text-[48px] md:leading-10">
              <span className="block sm:inline">입학 전에도, 재학 중에도</span>
              <br className="hidden sm:block" />
              <span className="mt-1 flex flex-wrap items-center justify-center gap-x-2 md:mt-2.5 md:inline-flex md:gap-x-3">
                <span>동아리 정보는</span>
                <span className="text-primary-500 inline-flex items-center [font-family:var(--font-cal-sans)] text-[44px] leading-none md:text-[64px]">
                  Konect
                </span>
                <span>에서</span>
              </span>
            </h1>
          </div>
          <img
            className="pointer-events-none absolute hidden object-contain lg:-top-6 lg:right-[9%] lg:block lg:size-46"
            src={heroCatBook}
            alt=""
          />
          <p className="text-text-400 mt-8 md:mt-20 md:text-[20px] md:leading-8">
            대학 이름을 검색하거나 목록에서 선택하면 <br className="block md:hidden" />
            해당 학교에 등록된 동아리 정보를 확인할 수 있어요.
          </p>

          <label className="border-text-100 focus-within:border-primary-500 mt-12 flex h-16 w-full max-w-255 items-center rounded-[30px] border bg-white px-8 transition-[border-color,box-shadow] focus-within:shadow-[0_0_30px_0_rgba(105,191,223,0.30)] sm:mt-25 sm:h-19.5">
            <span className="sr-only">학교명 검색</span>
            <input
              className="text-text-700 placeholder:text-text-300 min-w-0 flex-1 bg-transparent text-sm outline-none sm:text-[24px] sm:leading-10 sm:font-medium"
              value={searchKeyword}
              onChange={handleSearchKeywordChange}
              placeholder="학교명을 검색해 보세요"
            />
            <SearchIcon className="h-6 sm:h-12" />
          </label>
        </section>

        <div
          className={`grid w-full transition-[grid-template-rows,opacity,margin-top] duration-300 ease-out ${
            isSearching ? 'mt-0 grid-rows-[0fr] opacity-0' : 'mt-20 grid-rows-[1fr] opacity-100 sm:mt-24'
          }`}
        >
          <section className="min-h-0 overflow-hidden" aria-hidden={isSearching}>
            <SectionTitle title="최근에 본 동아리" description="관심있게 봤던 동아리를 다시 확인해보세요." />
            <RecentClubList
              className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              emptyClassName="mt-4"
            />
          </section>
        </div>

        <section className="mt-10 w-full sm:mt-31.75">
          <SectionTitle title="전체 대학" description="학교별 동아리를 자유롭게 탐색해보세요." />
          <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 gap-y-2">
            <div className="flex min-w-0 flex-wrap gap-2">
              {REGION_OPTIONS.map((region) => {
                const isSelected = region.value === selectedRegion;

                return (
                  <button
                    className={`shrink-0 rounded-[26px] px-3 transition-colors sm:px-5 ${
                      isSelected
                        ? 'bg-primary-900 text-indigo-5 font-medium'
                        : 'border-text-300 text-text-300 hover:border-primary-500 hover:text-primary-700 border bg-transparent'
                    }`}
                    key={region.label}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedRegion(region.value)}
                  >
                    <span className="leading-7 sm:text-[20px] sm:leading-10">{region.label}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-text-500 flex shrink-0 items-center text-right text-sm leading-7 whitespace-nowrap sm:text-[20px] sm:leading-10">
              총<strong className="ml-1 font-bold">{totalUniversityCount}</strong>개 대학
            </p>
          </div>

          <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {universities.length > 0 ? (
              universities.map((university) => <UniversityCard key={university.id} university={university} />)
            ) : (
              <UniversityListMessage message="검색 조건에 맞는 대학이 없어요." />
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function SectionTitle({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col">
      <h2 className="leading-10 font-semibold text-black sm:text-[20px]">{title}</h2>
      <p className="text-text-400 sm:leading-10">{description}</p>
    </div>
  );
}

// function UniversityCardSkeletonList() {
//   return Array.from({ length: 8 }, (_, index) => (
//     <div
//       className="border-text-100 flex h-[180px] animate-pulse flex-col items-center justify-center rounded-[20px] border bg-white p-[22px]"
//       key={index}
//     >
//       <span className="bg-text-100 size-[50px] rounded-full" />
//       <span className="bg-text-100 mt-6 h-5 w-32 rounded" />
//       <span className="bg-text-100 mt-4 h-4 w-20 rounded" />
//     </div>
//   ));
// }

function UniversityListMessage({ message }: { message: string }) {
  return (
    <div className="border-text-100 text-text-500 flex h-45 items-center justify-center rounded-[20px] border bg-white text-center text-[18px] leading-8 sm:col-span-2 lg:col-span-3 xl:col-span-4">
      {message}
    </div>
  );
}

function UniversityCard({ university }: { university: University }) {
  const universityLabel = university.campusName ? `${university.name} ${university.campusName}` : university.name;

  return (
    <Link
      to={`/universities/${university.id}/clubs`}
      className="border-text-100 hover:border-primary-500 focus-visible:outline-primary-500 flex h-38.75 w-62.25 flex-col items-center justify-center rounded-[20px] border bg-white text-center transition-colors hover:shadow-[0_0_30px_0_rgba(105,191,223,0.30)] focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      <img className="size-10 object-contain" src={university.imageUrl} alt="" />
      <span className="block truncate text-[18px] leading-10 font-semibold text-black">{universityLabel}</span>
      <span className="text-text-600 text-[13px] leading-6 font-medium">{university.clubCount}개 동아리</span>
    </Link>
  );
}

export default Home;
