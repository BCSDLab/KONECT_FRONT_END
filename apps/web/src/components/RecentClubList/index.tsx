import { cn } from '@konect/utils/cn';
import { useSuspenseQuery } from '@tanstack/react-query';

import { recentClubQueries } from '@/apis/recentClub/queries';
import RecentClubCard from '@/components/RecentClubCard';
import { useRecentClubIds } from '@/utils/recentClubStorage';

interface RecentClubListProps {
  className: string;
  emptyClassName?: string;
}

function RecentClubList({ className, emptyClassName }: RecentClubListProps) {
  const recentClubIds = useRecentClubIds();

  if (recentClubIds.length === 0) {
    return <RecentClubListMessage className={emptyClassName} message="최근에 본 동아리가 없어요." />;
  }

  return <RecentClubListContent className={className} emptyClassName={emptyClassName} recentClubIds={recentClubIds} />;
}

function RecentClubListContent({
  className,
  emptyClassName,
  recentClubIds,
}: RecentClubListProps & { recentClubIds: number[] }) {
  const { data } = useSuspenseQuery(recentClubQueries.list(recentClubIds));
  const recentClubs = data.clubs;

  if (recentClubs.length === 0) {
    return <RecentClubListMessage className={emptyClassName} message="최근에 본 동아리가 없어요." />;
  }

  return (
    <div className={className}>
      {recentClubs.map((club) => (
        <RecentClubCard key={club.id} club={club} />
      ))}
    </div>
  );
}

function RecentClubListMessage({ className, message }: { className?: string; message: string }) {
  return (
    <p
      className={cn(
        'border-primary-200 text-text-400 bg-web-background rounded-[20px] border px-6 py-8 text-center text-[16px] leading-7',
        className
      )}
    >
      {message}
    </p>
  );
}

export default RecentClubList;
