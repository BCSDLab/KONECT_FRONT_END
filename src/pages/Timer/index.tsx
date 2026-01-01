import { useState } from 'react';
import clsx from 'clsx';
import { useBottomSheet } from '@/utils/hooks/useBottomSheet';
import { useTimer } from '@/utils/hooks/useTimer';
import RankingItem from './components/RankingItem';
import TimerButton from './components/TimerButton';

type TabType = '동아리' | '학년' | '개인';

function TimerPage() {
  const { time, isRunning, toggle } = useTimer();
  const { position, isDragging, currentTranslate, sheetRef, handlers } = useBottomSheet();
  const [activeTab, setActiveTab] = useState<TabType>('개인');

  const rankingsData: Record<
    TabType,
    Array<{
      rank: number | null;
      name: string;
      school: string;
      total: string;
      today: string;
      isMe?: boolean;
    }>
  > = {
    동아리: [
      { rank: 4, name: 'BCSD', school: '', total: '1245시간', today: '32시간', isMe: true },
      { rank: 1, name: 'KUT', school: '', total: '4000시간', today: '120시간' },
      { rank: 2, name: '한소리', school: '', total: '3900시간', today: '93시간' },
      { rank: 3, name: '비상', school: '', total: '3899시간', today: '101시간' },
      { rank: 5, name: 'KORA', school: '', total: '1100시간', today: '45시간' },
      { rank: 6, name: '밥버러지', school: '', total: '110시간', today: '43시간' },
      { rank: 7, name: '동아퀴', school: '', total: '11시간', today: '4시간' },
    ],
    학년: [
      { rank: 1, name: '1학년', school: '', total: '5000시간', today: '150시간' },
      { rank: 2, name: '2학년', school: '', total: '4500시간', today: '130시간' },
      { rank: 3, name: '3학년', school: '', total: '4000시간', today: '100시간', isMe: true },
      { rank: 4, name: '4학년', school: '', total: '3500시간', today: '80시간' },
    ],
    개인: [
      { rank: null, name: '이준영', school: '한국기술교육대학교', total: '50:42:49', today: '00:12:33', isMe: true },
      { rank: 1, name: '김혜준', school: '한국기술교육대학교', total: '118:42:49', today: '12:34:44' },
      { rank: 2, name: '공우진', school: '한국기술교육대학교', total: '112:41:49', today: '9:34:44' },
      { rank: 3, name: '홍길동', school: '한국기술교육대학교', total: '100:30:00', today: '8:00:00' },
      { rank: 4, name: '김철수', school: '한국기술교육대학교', total: '95:20:00', today: '7:30:00' },
      { rank: 5, name: '이영희', school: '한국기술교육대학교', total: '90:10:00', today: '6:00:00' },
    ],
  };

  const tabs: TabType[] = ['동아리', '학년', '개인'];
  const rankings = rankingsData[activeTab];

  const myRanking = rankings.find((item) => item.isMe);
  const sortedRankings = rankings.slice().sort((a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity));

  return (
    <div className="relative h-full overflow-hidden">
      {isRunning && <div className="fixed inset-0 z-30 bg-black/70" />}
      <div className="py-3">
        <TimerButton time={time} isRunning={isRunning} onToggle={toggle} />
      </div>

      <div
        ref={sheetRef}
        className={clsx(
          'fixed inset-x-0 bottom-0 z-20 rounded-t-3xl bg-white transition-transform duration-300 ease-out',
          isDragging && 'transition-none'
        )}
        style={{
          height: 'calc(100% - 48px)',
          transform: `translateY(${
            position === 'half' ? `calc(55% + ${currentTranslate}px)` : `${Math.max(0, currentTranslate)}px`
          })`,
        }}
      >
        <div className="flex h-5 cursor-grab items-center justify-center active:cursor-grabbing" {...handlers}>
          <div className="h-1 w-11 rounded-full bg-indigo-300" />
        </div>
        <div className="relative flex items-center justify-center px-4 font-semibold">
          <div className="text-center text-[15px] leading-6 text-indigo-700">랭킹</div>
          <button className="absolute right-5 text-sm leading-5 text-indigo-300">설정</button>
        </div>

        <div className="flex pt-2.5 pb-0.5">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={clsx(
                'flex-1 border-b-[1.4px] py-1.5 text-center text-[13px] font-semibold',
                activeTab === tab ? 'border-blue-500 text-indigo-700' : 'border-transparent text-indigo-200'
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto" style={{ height: 'calc(100% - 48px)' }}>
          {myRanking && <RankingItem item={myRanking} />}
          {sortedRankings.map((item, index) => (
            <RankingItem key={index} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default TimerPage;
