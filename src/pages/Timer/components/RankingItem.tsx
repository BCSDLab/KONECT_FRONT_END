import clsx from 'clsx';
import type { StudyRanking, StudyRankingParams } from '@/apis/studyTime/entity';
import { useInfiniteScroll } from '@/utils/hooks/useInfiniteScroll';
import { formatTime } from '@/utils/ts/time';
import { useStudyTimeRanking } from '../hooks/useStudyTimeRanking';

interface RankingItemProps {
  item: StudyRanking;
  isMe?: boolean;
  sort: 'MONTHLY' | 'DAILY';
  type: StudyRankingParams['type'];
}

function RankingItem({ item, isMe, sort, type }: RankingItemProps) {
  const studyTime = sort === 'MONTHLY' ? item.monthlyStudyTime : item.dailyStudyTime;

  return (
    <div className={clsx('flex items-center gap-4 px-4 py-3', isMe && 'bg-indigo-5')}>
      <div className="w-10 text-center">
        {item.rank <= 3 ? (
          <span
            className={clsx(
              'inline-flex h-7 w-7 items-center justify-center rounded-full text-[13px] leading-3.5 font-bold text-white',
              item.rank === 1 && 'bg-[#FBBC05]',
              item.rank === 2 && 'bg-[#BAC3CD]',
              item.rank === 3 && 'bg-[#CA9369]'
            )}
          >
            {item.rank}
          </span>
        ) : (
          <span className="text-[13px] leading-3.5 font-bold text-indigo-700">{item.rank}</span>
        )}
      </div>
      <div className="flex-1">
        <span className="text-[17px] leading-[19px] font-bold text-indigo-700">
          {item.name}
          {type === 'STUDENT_NUMBER' && '학번'}
        </span>
        <div className="text-[13px] leading-4 text-indigo-300">공부시간 : {formatTime(studyTime)}</div>
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

  return (
    <div className="h-full overflow-y-auto">
      {myRankings.map(
        (item, index) =>
          item && <RankingItem key={`my-${index}-${item.rank}-${item.name}`} item={item} isMe sort={sort} type={type} />
      )}
      {rankings.map((item, index) => (
        <RankingItem key={`ranking-${index}-${item.rank}-${item.name}`} item={item} sort={sort} type={type} />
      ))}
      {hasNextPage && <div ref={observerRef} className="flex h-20 items-center justify-center" />}
    </div>
  );
}

export default RankingItem;
