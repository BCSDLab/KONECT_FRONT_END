import type { StudyRanking, StudyRankingParams } from '@/apis/studyTime/entity';
import { useInfiniteScroll } from '@/utils/hooks/useInfiniteScroll';
import { cn } from '@/utils/ts/cn';
import { formatTime } from '@/utils/ts/datetime/time';
import { useStudyTimeRanking } from '../hooks/useStudyTimeRanking';

interface RankingItemProps {
  item: StudyRanking;
  isMe?: boolean;
  sort: 'MONTHLY' | 'DAILY';
  type: StudyRankingParams['type'];
}

function RankingItem({ item, isMe, sort, type }: RankingItemProps) {
  const studyTime = sort === 'MONTHLY' ? item.monthlyStudyTime : item.dailyStudyTime;
  const displayName = `${item.name}${type === 'STUDENT_NUMBER' ? '학번' : ''}${isMe ? ' (나)' : ''}`;

  return (
    <div className={cn('mx-auto flex w-full max-w-[334px] items-center gap-5 py-3', isMe && 'bg-transparent')}>
      <div className="flex size-7 shrink-0 items-center justify-center">
        {item.rank <= 3 ? (
          <span
            className={cn(
              'inline-flex size-7 items-center justify-center rounded-full text-[16px] leading-[1.6] font-semibold text-white',
              item.rank === 1 && 'bg-[#FBBC05]',
              item.rank === 2 && 'bg-[#BAC3CD]',
              item.rank === 3 && 'bg-[#C99B84]'
            )}
          >
            {item.rank}
          </span>
        ) : (
          <span className="text-[16px] leading-[1.6] font-semibold text-[#5A6B7F]">{item.rank}</span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <span className="text-text-700 truncate text-[16px] leading-[1.6] font-semibold">{displayName}</span>
        <div className="mt-1 text-[14px] leading-[1.6] font-medium text-[#5A6B7F]">
          공부시간 : {formatTime(studyTime)}
        </div>
      </div>
    </div>
  );
}

interface RankingListProps {
  type: StudyRankingParams['type'];
  sort: StudyRankingParams['sort'];
}

export function RankingList({ type, sort }: RankingListProps) {
  const { rankings, myRankings, fetchNextPage, hasNextPage, isFetchingNextPage } = useStudyTimeRanking({ type, sort });
  const observerRef = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage);
  const shouldPinMyRanking = type === 'PERSONAL';

  return (
    <div className="h-full overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {shouldPinMyRanking
        ? myRankings.map(
            (item, index) =>
              item && (
                <RankingItem key={`my-${index}-${item.rank}-${item.name}`} item={item} isMe sort={sort} type={type} />
              )
          )
        : null}
      {rankings.map((item, index) => (
        <RankingItem key={`ranking-${index}-${item.rank}-${item.name}`} item={item} sort={sort} type={type} />
      ))}
      {hasNextPage && <div ref={observerRef} className="flex h-20 items-center justify-center" />}
    </div>
  );
}

export default RankingItem;
