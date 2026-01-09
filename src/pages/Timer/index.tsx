import { useState, useTransition } from 'react';
import clsx from 'clsx';
import type { StudyRankingParams } from '@/apis/studyTime/entity';
import { useBottomSheet } from '@/utils/hooks/useBottomSheet';
import { RankingList } from './components/RankingItem';
import TimerButton from './components/TimerButton';
import { useStudyTimer } from './hooks/useStudyTimer';

type TabType = '동아리' | '학번' | '개인';

const TAB_TO_TYPE: Record<TabType, StudyRankingParams['type']> = {
  동아리: 'CLUB',
  학번: 'STUDENT_NUMBER',
  개인: 'PERSONAL',
};

function TimerPage() {
  const { todayAccumulatedSeconds, sessionStartMs, isRunning, toggle, isStarting, isStopping } = useStudyTimer();
  const { position, isDragging, currentTranslate, sheetRef, handlers } = useBottomSheet();

  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<TabType>('개인');
  const [sort] = useState<StudyRankingParams['sort']>('MONTHLY');

  const tabs: TabType[] = ['동아리', '학번', '개인'];
  const isBusy = isStarting || isStopping;

  return (
    <div className="relative h-full overflow-hidden">
      {isRunning && <div className="fixed inset-0 z-30 bg-black/70" />}

      <div className="py-3">
        <div className={clsx(isBusy && 'pointer-events-none opacity-80')}>
          <TimerButton
            todayAccumulatedSeconds={todayAccumulatedSeconds}
            sessionStartMs={sessionStartMs}
            isRunning={isRunning}
            onToggle={toggle}
          />
        </div>
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
              onClick={() => startTransition(() => setActiveTab(tab))}
              className={clsx(
                'flex-1 border-b-[1.4px] py-1.5 text-center text-[13px] font-semibold',
                activeTab === tab ? 'border-blue-500 text-indigo-700' : 'border-transparent text-indigo-200'
              )}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className={clsx(isPending && 'opacity-60 transition-opacity')}>
          <RankingList type={TAB_TO_TYPE[activeTab]} sort={sort} />
        </div>
      </div>
    </div>
  );
}

export default TimerPage;
