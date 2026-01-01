import clsx from 'clsx';

interface RankingItemType {
  rank: number | null;
  name: string;
  school: string;
  total: string;
  today: string;
  isMe?: boolean;
}

interface RankingItemProps {
  item: RankingItemType;
}

const RankingItem = ({ item }: RankingItemProps) => (
  <div className={clsx('flex items-center gap-4 px-4 py-3', item.isMe && 'bg-indigo-5')}>
    <div className="w-10 text-center">
      {item.rank && item.rank <= 3 ? (
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
        <span className="text-[13px] leading-3.5 font-bold text-indigo-700">
          {item.rank || (item.isMe ? '1290' : '')}
        </span>
      )}
    </div>
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <span className="text-[17px] leading-[19px] font-bold text-indigo-700">{item.name}</span>
        {item.school && <span className="text-[11px] leading-[15px] text-indigo-300">{item.school}</span>}
      </div>
      <div className="text-[13px] leading-4 text-indigo-300">
        누적 공부시간 : {item.total} | 오늘 공부시간 : {item.today}
      </div>
    </div>
  </div>
);

export default RankingItem;
