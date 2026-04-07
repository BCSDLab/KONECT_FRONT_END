import type { StudyRanking, StudyRankingParams } from '@/apis/studyTime/entity';
import { cn } from '@/utils/ts/cn';
import { formatTime } from '@/utils/ts/datetime/time';

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
    <div className={cn('mx-auto flex w-full max-w-83.5 items-center gap-5 py-3', isMe && 'bg-transparent')}>
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
          <span className="text-text-500 leading-[1.6] font-semibold">{item.rank}</span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <span className="text-text-700 truncate leading-[1.6] font-semibold">{displayName}</span>
        <div className="text-text-500 mt-1 text-[14px] leading-[1.6] font-medium">
          공부시간 : {formatTime(studyTime)}
        </div>
      </div>
    </div>
  );
}

export default RankingItem;
