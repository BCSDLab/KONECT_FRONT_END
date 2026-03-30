import { useEffect } from 'react';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import type { AppliedClub, Club, JoinClub } from '@/apis/club/entity';
import { clubQueries } from '@/apis/club/queries';
import Card from '@/components/common/Card';
import InfiniteClubCarousel from '@/pages/Home/components/InfiniteClubCarousel';
import { RECOMMENDED_CLUB_CARD_HEIGHT, RECOMMENDED_CLUB_CARD_WIDTH } from '@/pages/Home/components/RecommendedClubCard';
import SectionErrorFallback from '@/pages/Home/components/SectionErrorFallback';
import SectionTitle from '@/pages/Home/components/SectionTitle';
import { useGetHomeMyClubs } from '@/pages/Home/hooks/useGetHomeClubs';
import type { HomeClubCardItem } from '@/pages/Home/types';

const CLUB_CAROUSEL_LIMIT = 20;

function RecommendedClubCardSkeleton() {
  return (
    <div className="shrink-0 py-1" style={{ width: `${RECOMMENDED_CLUB_CARD_WIDTH}px` }}>
      <div
        className="flex items-center rounded-lg border border-[#f4f6f9] bg-white px-4 shadow-[0_0_3px_rgba(0,0,0,0.2)]"
        style={{ height: `${RECOMMENDED_CLUB_CARD_HEIGHT}px` }}
      >
        <div className="bg-indigo-25 size-[59px] shrink-0 animate-pulse rounded-sm" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-col items-end text-right">
            <div className="bg-indigo-25 h-4 w-24 animate-pulse rounded" />
            <div className="bg-indigo-25 mt-[5px] h-4 w-14 animate-pulse rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

function RecommendedClubsSkeleton() {
  return (
    <>
      <div
        className="overflow-hidden pb-1"
        style={{ paddingInline: `calc((100% - ${RECOMMENDED_CLUB_CARD_WIDTH}px) / 2)` }}
      >
        <div className="flex gap-2">
          <RecommendedClubCardSkeleton />
          <RecommendedClubCardSkeleton />
          <RecommendedClubCardSkeleton />
        </div>
      </div>
      <div className="mx-auto h-[5px] w-[60px] rounded-[40px] bg-[#d9d9d9]" />
    </>
  );
}

function HomeClubSectionHeaderSkeleton() {
  return (
    <div className="flex items-center justify-between">
      <div className="bg-indigo-25 h-5 w-40 animate-pulse rounded" />
      <div className="bg-indigo-25 h-4 w-10 animate-pulse rounded" />
    </div>
  );
}

function normalizeJoinedClub(club: JoinClub): HomeClubCardItem {
  return {
    id: club.id,
    name: club.name,
    imageUrl: club.imageUrl,
    subLabel: club.categoryName,
    badgeLabel: club.position === '일반회원' ? undefined : '운영진',
  };
}

function normalizeAppliedClub(club: AppliedClub): HomeClubCardItem {
  return {
    id: club.id,
    name: club.name,
    imageUrl: club.imageUrl,
    subLabel: club.categoryName,
    badgeLabel: '승인 대기',
  };
}

function normalizeRecruitingClub(club: Club): HomeClubCardItem {
  return {
    id: club.id,
    name: club.name,
    imageUrl: club.imageUrl,
    subLabel: club.categoryName,
  };
}

export function HomeClubSectionSkeleton() {
  return (
    <div className="flex flex-col gap-1">
      <HomeClubSectionHeaderSkeleton />
      <RecommendedClubsSkeleton />
    </div>
  );
}

export function HomeClubSectionErrorFallback() {
  return (
    <div className="flex flex-col gap-1">
      <HomeClubSectionHeaderSkeleton />
      <SectionErrorFallback />
    </div>
  );
}

function RecruitingClubSection() {
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useSuspenseInfiniteQuery(
    clubQueries.infiniteList({ limit: CLUB_CAROUSEL_LIMIT, isRecruiting: true })
  );

  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const clubs = data.pages.flatMap((page) => page.clubs).map(normalizeRecruitingClub);

  if (clubs.length === 0) {
    return (
      <div className="flex flex-col gap-1">
        <SectionTitle title="나에게 맞는 동아리를 찾아보세요!" to="/clubs" />
        <Card className="gap-2 rounded-[20px] border-0 py-5 shadow-[0_0_3px_rgba(0,0,0,0.2)]">
          <div className="text-h3 text-indigo-700">현재 모집 중인 동아리가 없어요</div>
          <Link to="/clubs" className="bg-primary text-sub2 block rounded-lg py-3 text-center text-white">
            동아리 보러가기
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <SectionTitle title="나에게 맞는 동아리를 찾아보세요!" to="/clubs" />
      <InfiniteClubCarousel clubs={clubs} />
    </div>
  );
}

function HomeClubSection() {
  const { appliedClubs, joinedClubs } = useGetHomeMyClubs();
  const clubs = [...appliedClubs.map(normalizeAppliedClub), ...joinedClubs.map(normalizeJoinedClub)];

  if (clubs.length === 0) {
    return <RecruitingClubSection />;
  }

  return (
    <div className="flex flex-col gap-1">
      <SectionTitle title="내 동아리" to="/clubs" />
      <InfiniteClubCarousel clubs={clubs} />
    </div>
  );
}

export default HomeClubSection;
