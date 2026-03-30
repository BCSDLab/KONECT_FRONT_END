import { Link } from 'react-router-dom';
import type { HomeClubCardItem } from '@/pages/Home/types';
import { cn } from '@/utils/ts/cn';

export const RECOMMENDED_CLUB_CARD_WIDTH = 191;
export const RECOMMENDED_CLUB_CARD_HEIGHT = 97;

interface RecommendedClubCardProps {
  club: HomeClubCardItem;
  className?: string;
  tabIndex?: number;
  ariaHidden?: boolean;
  imageLoading?: 'eager' | 'lazy';
  imageFetchPriority?: 'auto' | 'high' | 'low';
}

function RecommendedClubCard({
  club,
  className,
  tabIndex,
  ariaHidden = false,
  imageLoading = 'lazy',
  imageFetchPriority = 'low',
}: RecommendedClubCardProps) {
  return (
    <Link
      to={`/clubs/${club.id}`}
      tabIndex={tabIndex}
      aria-hidden={ariaHidden}
      style={{ height: `${RECOMMENDED_CLUB_CARD_HEIGHT}px`, width: `${RECOMMENDED_CLUB_CARD_WIDTH}px` }}
      className={cn(
        'border-indigo-5 flex items-center justify-between rounded-lg border bg-white px-4 shadow-[0_0_3px_rgba(0,0,0,0.2)]',
        className
      )}
    >
      <img
        src={club.imageUrl}
        alt=""
        aria-hidden="true"
        loading={imageLoading}
        decoding="async"
        fetchPriority={imageFetchPriority}
        className={cn('bg-indigo-5 size-[59px] shrink-0 rounded-sm object-cover')}
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-col items-end text-right">
          <div className="max-h-9 w-full overflow-hidden text-right leading-[18px] font-extrabold break-keep text-indigo-700">
            {club.name}
          </div>
          {club.badgeLabel && (
            <div className="mt-[5px]">
              <div className="bg-text-100/90 text-text-500 inline-flex shrink-0 items-center rounded-full px-2 py-1 text-[10px] leading-none font-semibold">
                {club.badgeLabel}
              </div>
            </div>
          )}
          {!club.badgeLabel && club.subLabel && (
            <div className="mt-[5px] w-full truncate text-right text-[12px] leading-[18px] font-medium whitespace-nowrap text-[#5a6b7f]">
              {club.subLabel}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default RecommendedClubCard;
