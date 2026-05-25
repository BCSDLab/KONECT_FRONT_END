import { cn } from '@konect/utils/cn';
import { Link } from 'react-router-dom';

import type { RecentClub } from '@/apis/recentClub/entity';
import { CATEGORY_TEXT_COLORS } from '@/constants/club';
import { useRecentClubs } from '@/hooks/useRecentClubs';

function RecentClubSidebarSection({ currentClubId }: { currentClubId?: number }) {
  const { data } = useRecentClubs(currentClubId);
  const recentClubs = data?.clubs ?? [];

  return (
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
  );
}

function RecentClubCard({ club }: { club: RecentClub }) {
  return (
    <Link
      className="border-primary-200 bg-web-background hover:border-primary-500 focus-visible:outline-primary-500 flex h-30.5 max-h-30.5 min-h-30.5 w-full shrink-0 items-center gap-7 overflow-hidden rounded-[20px] border px-7.5 py-6.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
      to={`/clubs/${club.id}`}
    >
      <ClubImage imageUrl={club.imageUrl} name={club.name} />
      <span className="min-w-0">
        <span className="block w-57 truncate text-[20px] leading-10 font-semibold text-black">{club.name}</span>
        <span className="flex min-w-0 items-center gap-2 text-[16px] leading-10">
          <span className={cn('shrink-0 font-semibold', CATEGORY_TEXT_COLORS[club.category])}>{club.categoryName}</span>
          <span className="bg-text-200 size-1.5 shrink-0 rounded-full" aria-hidden="true" />
          <span className="text-text-600 min-w-0 truncate font-medium">{club.topic || club.description}</span>
        </span>
      </span>
    </Link>
  );
}

function ClubImage({ imageUrl, name }: { imageUrl?: string; name: string }) {
  if (imageUrl) {
    return <img className="size-17.5 shrink-0 object-contain" src={imageUrl} alt="" />;
  }

  return (
    <span className="bg-primary-100 border-primary-200 block size-17.5 shrink-0 rounded-full border">
      <span className="sr-only">{name}</span>
    </span>
  );
}

export default RecentClubSidebarSection;
