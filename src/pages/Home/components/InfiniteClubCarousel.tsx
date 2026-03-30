import RecommendedClubCard, { RECOMMENDED_CLUB_CARD_WIDTH } from '@/pages/Home/components/RecommendedClubCard';
import { useInfiniteClubCarousel } from '@/pages/Home/hooks/useInfiniteClubCarousel';
import type { HomeClubCardItem } from '@/pages/Home/types';
import { cn } from '@/utils/ts/cn';

interface InfiniteClubCarouselProps {
  clubs: HomeClubCardItem[];
}

function isPriorityImage(index: number, clubsLength: number, shouldLoop: boolean) {
  const visibleCount = 2;

  if (!shouldLoop) {
    return index < visibleCount;
  }

  const middleSegmentStartIndex = clubsLength;
  const middleSegmentVisibleRadius = 1;
  const isInInitialVisibleRange = index < visibleCount;
  const isInMiddleVisibleRange =
    index >= middleSegmentStartIndex - middleSegmentVisibleRadius &&
    index <= middleSegmentStartIndex + middleSegmentVisibleRadius;

  return isInInitialVisibleRange || isInMiddleVisibleRange;
}

function InfiniteClubCarousel({ clubs }: InfiniteClubCarouselProps) {
  const {
    displayClubs,
    handleScroll,
    indicatorOffset,
    indicatorThumbWidth,
    scrollRef,
    shouldCenterCard,
    shouldLoop,
    showIndicator,
  } = useInfiniteClubCarousel({ clubs });
  const centeredPaddingStyle = shouldCenterCard
    ? { paddingInline: `calc((100% - ${RECOMMENDED_CLUB_CARD_WIDTH}px) / 2)` }
    : undefined;

  return (
    <div>
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        style={centeredPaddingStyle}
        className={cn(
          'snap-x snap-mandatory overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          shouldCenterCard ? 'px-0' : ''
        )}
      >
        <div className="flex gap-2">
          {displayClubs.map(({ club, key }, index) => {
            const isDuplicate = shouldLoop && (index < clubs.length || index >= clubs.length * 2);
            const isPriority = isPriorityImage(index, clubs.length, shouldLoop);

            return (
              <div
                key={key}
                className={cn('shrink-0 py-1', shouldCenterCard ? 'snap-center' : 'snap-start px-[3px]')}
                style={{ width: `${RECOMMENDED_CLUB_CARD_WIDTH}px` }}
              >
                <RecommendedClubCard
                  club={club}
                  className="w-full"
                  ariaHidden={isDuplicate}
                  imageFetchPriority={isPriority ? 'auto' : 'low'}
                  imageLoading={isPriority ? 'eager' : 'lazy'}
                  tabIndex={isDuplicate ? -1 : 0}
                />
              </div>
            );
          })}
        </div>
      </div>
      {showIndicator && (
        <div className="mx-auto h-[5px] w-[60px] rounded-[40px] bg-[#d9d9d9]">
          <div
            className="h-full rounded-[40px] bg-[#b4b4b4] transition-transform duration-200 ease-out"
            style={{
              width: `${indicatorThumbWidth}px`,
              transform: `translateX(${indicatorOffset}px)`,
            }}
          />
        </div>
      )}
    </div>
  );
}

export default InfiniteClubCarousel;
