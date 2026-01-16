import { useState, useTransition } from 'react';
import clsx from 'clsx';
import type { StudyRankingParams } from '@/apis/studyTime/entity';
import Dropdown from '@/components/common/Dropdown';
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

const SORT_OPTIONS = [
  { value: 'MONTHLY', label: '월간' },
  { value: 'DAILY', label: '일간' },
] as const;

function TimerPage() {
  const { todayAccumulatedSeconds, sessionStartMs, isRunning, toggle, isStarting, isStopping } = useStudyTimer();
  const { position, isDragging, currentTranslate, sheetRef, handlers } = useBottomSheet();

  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<TabType>('개인');
  const [sort, setSort] = useState<StudyRankingParams['sort']>('MONTHLY');

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
          'fixed inset-x-0 z-20 flex flex-col rounded-t-3xl bg-white transition-transform duration-300 ease-out',
          isDragging && 'transition-none'
        )}
        style={{
          bottom: 'calc(var(--bottom-nav-h) + var(--sab))',
          height: 'calc(100% - 48px - (35px + var(--bottom-nav-h)) - var(--sab))',
          transform: `translateY(${
            position === 'half' ? `calc(55% + ${currentTranslate}px)` : `${Math.max(0, currentTranslate)}px`
          })`,
        }}
      >
        <div className="flex h-5 shrink-0 cursor-grab items-center justify-center active:cursor-grabbing" {...handlers}>
          <div className="h-1 w-11 rounded-full bg-indigo-300" />
        </div>

        <div className="relative flex shrink-0 items-center justify-center px-4 font-semibold">
          <div className="text-center text-[15px] leading-6 text-indigo-700">랭킹</div>
          <Dropdown
            className="absolute right-4"
            options={SORT_OPTIONS}
            value={sort}
            onChange={(value) => startTransition(() => setSort(value))}
          />
        </div>

        <div className="flex shrink-0 pt-2.5 pb-0.5">
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
        <div
          className={clsx('min-h-0 overflow-hidden', isPending && 'opacity-60 transition-opacity')}
          style={{
            height: position === 'half' ? 'calc(45% - 70px)' : undefined,
            flex: position === 'full' ? 1 : undefined,
          }}
        >
          <RankingList type={TAB_TO_TYPE[activeTab]} sort={sort} />
        </div>
      </div>
    </div>
  );
}

export default TimerPage;
