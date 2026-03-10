import { useInfiniteClubCarousel } from '@/pages/Home/hooks/useInfiniteClubCarousel';
import type { HomeClubCardItem } from '@/pages/Home/types';
import { cn } from '@/utils/ts/cn';
import RecommendedClubCard from './RecommendedClubCard';

const CLUB_CARD_WIDTH = 229;

interface InfiniteClubCarouselProps {
  clubs: HomeClubCardItem[];
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

  return (
    <div className="gap-1">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className={cn(
          'snap-x snap-mandatory overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          shouldCenterCard ? 'px-[calc((100%-229px)/2)]' : ''
        )}
      >
        <div className="flex gap-2">
          {displayClubs.map(({ club, key }, index) => {
            const isDuplicate = shouldLoop && (index < clubs.length || index >= clubs.length * 2);

            return (
              <div
                key={key}
                className={cn('shrink-0 py-1', shouldCenterCard ? 'snap-center' : 'snap-start px-[3px]')}
                style={{ width: `${CLUB_CARD_WIDTH}px` }}
              >
                <RecommendedClubCard
                  club={club}
                  className="w-full"
                  ariaHidden={isDuplicate}
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
