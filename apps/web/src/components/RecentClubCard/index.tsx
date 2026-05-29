import { cn } from '@konect/utils/cn';
import { Link } from 'react-router-dom';

import type { RecentClub } from '@/apis/recentClub/entity';
import { CATEGORY_TEXT_COLORS } from '@/constants/club';

interface RecentClubCardProps {
  club: RecentClub;
}

function RecentClubCard({ club }: RecentClubCardProps) {
  return (
    <Link
      className="border-text-100 hover:border-primary-500 focus-visible:outline-primary-500 flex w-full items-center gap-4 overflow-hidden rounded-[20px] border bg-white px-5.5 py-5 transition-colors hover:shadow-[0_0_30px_0_rgba(105,191,223,0.30)] focus-visible:outline-2 focus-visible:outline-offset-2"
      to={`/clubs/${club.id}`}
    >
      <img className="size-12.5 shrink-0 rounded-full object-cover" src={club.categoryEmoji} alt="" />
      <span className="min-w-0">
        <span className="block truncate text-[14px] leading-10 font-semibold text-black">{club.name}</span>
        <span className="flex min-w-0 items-center gap-2 text-[12px] leading-6">
          <span className={cn('shrink-0 font-semibold', CATEGORY_TEXT_COLORS[club.category])}>{club.categoryName}</span>
          <span className="bg-text-200 size-1 rounded-full" aria-hidden="true" />
          <span className="text-text-600 min-w-0 truncate font-medium">{club.topic || club.description}</span>
        </span>
      </span>
    </Link>
  );
}

export default RecentClubCard;
