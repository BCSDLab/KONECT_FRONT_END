import { useEffect, useRef } from 'react';
import clsx from 'clsx';
import type { StudyRanking, StudyRankingParams } from '@/apis/studyTime/entity';
import { formatTime } from '@/utils/ts/time';
import { useStudyTimeRanking } from '../hooks/useStudyTimeRanking';

interface RankingItemProps {
  item: StudyRanking;
  isMe?: boolean;
  sort: 'MONTHLY' | 'DAILY';
}

function RankingItem({ item, isMe, sort }: RankingItemProps) {
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
        <span className="text-[17px] leading-[19px] font-bold text-indigo-700">{item.name}</span>
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
  const observerRef = useRef<HTMLDivElement>(null);
  const { rankings, myRankings, fetchNextPage, hasNextPage, isFetchingNextPage } = useStudyTimeRanking({ type, sort });

  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.3 }
    );

    const currentObserver = observerRef.current;
    if (currentObserver) {
      observer.observe(currentObserver);
    }

    return () => {
      if (currentObserver) {
        observer.unobserve(currentObserver);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="overflow-y-auto" style={{ height: 'calc(100% - 48px)' }}>
      {myRankings.map((item) => (
        <RankingItem key={`my-${item.rank}-${item.name}`} item={item} isMe sort={sort} />
      ))}
      {rankings.map((item) => (
        <RankingItem key={`${item.rank}-${item.name}`} item={item} sort={sort} />
      ))}
      {hasNextPage && <div ref={observerRef} className="flex h-20 items-center justify-center" />}
    </div>
  );
}

export default RankingItem;
