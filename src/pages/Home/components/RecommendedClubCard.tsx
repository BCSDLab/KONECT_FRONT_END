import { Link } from 'react-router-dom';
import type { HomeClubCardItem } from '@/pages/Home/types';
import { cn } from '@/utils/ts/cn';

interface RecommendedClubCardProps {
  club: HomeClubCardItem;
  className?: string;
  tabIndex?: number;
  ariaHidden?: boolean;
}

function RecommendedClubCard({ club, className, tabIndex, ariaHidden = false }: RecommendedClubCardProps) {
  return (
    <Link
      to={`/clubs/${club.id}`}
      tabIndex={tabIndex}
      aria-hidden={ariaHidden}
      className={cn(
        'flex h-[108px] items-center justify-between rounded-lg border border-[#f4f6f9] bg-white px-[27.5px] py-[24.5px] shadow-[0_0_3px_rgba(0,0,0,0.2)]',
        className
      )}
    >
      <img
        src={club.imageUrl}
        alt=""
        aria-hidden="true"
        className={cn('bg-indigo-5 h-[59px] w-[67px] shrink-0 rounded-sm object-cover')}
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
