import { Fragment, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { clubQueries } from '@/apis/club/queries';
import { useAdvertisementInterval } from '@/utils/hooks/useAdvertisementInterval';
import { useAdvertisements } from '@/utils/hooks/useAdvertisements';
import { useInfiniteScroll } from '@/utils/hooks/useInfiniteScroll';
import useScrollRestore from '@/utils/hooks/useScrollRestore';
import AdvertisementCard, { AdvertisementCardSkeleton } from './components/AdvertisementCard';
import ClubCard from './components/ClubCard';
import SearchBar from './components/SearchBar';

const SCROLL_RESTORE_KEY = 'clubList_shouldRestore';

function ClubList() {
  const shouldRestoreScroll = sessionStorage.getItem(SCROLL_RESTORE_KEY) === 'true';
  sessionStorage.removeItem(SCROLL_RESTORE_KEY);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery(
    clubQueries.infiniteList({ limit: 10, isRecruiting: false })
  );
  const observerRef = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage);

  useScrollRestore('clubList', !!data, shouldRestoreScroll);

  const totalCount = data?.pages[0]?.totalCount ?? 0;
  const allClubs = data?.pages.flatMap((page) => page.clubs) ?? [];
  const firstClubCardRef = useRef<HTMLAnchorElement>(null);
  const secondClubCardRef = useRef<HTMLAnchorElement>(null);
  const clubSlotsPerAdvertisement = useAdvertisementInterval({
    firstItemRef: firstClubCardRef,
    secondItemRef: secondClubCardRef,
    itemCount: allClubs.length,
    enabled: allClubs.length > 0,
  });
  const advertisementCount = clubSlotsPerAdvertisement ? Math.floor(allClubs.length / clubSlotsPerAdvertisement) : 0;
  const { advertisements, isLoadingAdvertisements, trackAdvertisementClick } = useAdvertisements({
    advertisementCount,
    scope: 'club-list',
  });

  return (
    <>
      <SearchBar isButton />
      <div className="h-16 shrink-0" />

      <div className="flex flex-col gap-2 px-5 pt-2 pb-4">
        <div className="text-sub2 px-3 text-indigo-300">총 {totalCount}개의 동아리</div>

        <div className="flex flex-col gap-2">
          {allClubs.map((club, index) => {
            const shouldRenderAdvertisement =
              clubSlotsPerAdvertisement !== null && (index + 1) % clubSlotsPerAdvertisement === 0;
            const advertisement = shouldRenderAdvertisement
              ? advertisements[Math.floor(index / clubSlotsPerAdvertisement)]
              : undefined;

            return (
              <Fragment key={club.id}>
                <ClubCard
                  club={club}
                  itemRef={index === 0 ? firstClubCardRef : index === 1 ? secondClubCardRef : undefined}
                />
                {advertisement && <AdvertisementCard advertisement={advertisement} onClick={trackAdvertisementClick} />}
                {!advertisement && shouldRenderAdvertisement && isLoadingAdvertisements && (
                  <AdvertisementCardSkeleton />
                )}
              </Fragment>
            );
          })}
        </div>

        {hasNextPage && <div ref={observerRef} className="flex h-20 items-center justify-center" />}
      </div>
    </>
  );
}

export default ClubList;
