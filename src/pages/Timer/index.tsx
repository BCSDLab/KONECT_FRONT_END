import { useRef, useState, useTransition } from 'react';
import type { StudyRankingParams } from '@/apis/studyTime/entity';
import BottomSheet, { type SheetPosition } from '@/components/common/BottomSheet';
import Dropdown from '@/components/common/Dropdown';
import { useLayoutElementsContext } from '@/contexts/useLayoutElementsContext';
import RankingList from '@/pages/Timer/components/RankingList';
import TimerButton from '@/pages/Timer/components/TimerButton';
import { useStudyTimer } from '@/pages/Timer/hooks/useStudyTimer';
import { useTimerLayout } from '@/pages/Timer/hooks/useTimerLayout';
import { cn } from '@/utils/ts/cn';

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
  const { bottomOverlayInsetPx } = useLayoutElementsContext();
  const timerSectionRef = useRef<HTMLDivElement>(null);

  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<TabType>('개인');
  const [sort, setSort] = useState<StudyRankingParams['sort']>('MONTHLY');
  const [sheetPosition, setSheetPosition] = useState<SheetPosition>('half');
  const [autoExpandResetKey, setAutoExpandResetKey] = useState(0);

  const tabs: TabType[] = ['동아리', '학번', '개인'];
  const isBusy = isStarting || isStopping;
  const { bottomInsetPx, fullSheetTopOffset, halfSheetTopOffset, timerSectionPaddingTopClassName, timerSize } =
    useTimerLayout({
      bottomOverlayInsetPx,
      timerSectionRef,
    });

  const handleSheetPositionChange = (nextPosition: SheetPosition) => {
    if (sheetPosition === 'full' && nextPosition === 'half') {
      setAutoExpandResetKey((prev) => prev + 1);
    }

    setSheetPosition(nextPosition);
  };

  return (
    <div className={cn('bg-indigo-5 relative min-h-full overflow-hidden', timerSectionPaddingTopClassName)}>
      <div ref={timerSectionRef} className="mx-auto w-full max-w-[390px] px-6">
        <div className={cn(isBusy && 'pointer-events-none opacity-80')}>
          <TimerButton
            todayAccumulatedSeconds={todayAccumulatedSeconds}
            sessionStartMs={sessionStartMs}
            isRunning={isRunning}
            onToggle={toggle}
            size={timerSize}
          />
        </div>
      </div>

      <BottomSheet
        resizable
        position={sheetPosition}
        halfTopOffset={halfSheetTopOffset}
        fullTopOffset={fullSheetTopOffset}
        onPositionChange={handleSheetPositionChange}
      >
        {(position) => (
          <div className="flex min-h-0 flex-1 flex-col">
            <div className="relative shrink-0 px-5">
              <div className="text-text-700 text-center text-[16px] leading-[1.6] font-bold">랭킹</div>
              <Dropdown
                className="absolute top-0 right-5"
                options={SORT_OPTIONS}
                value={sort}
                onChange={(value) => startTransition(() => setSort(value))}
              />
            </div>

            <div className="mt-2.5 flex w-full shrink-0 items-center justify-between">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => startTransition(() => setActiveTab(tab))}
                  className={cn(
                    'flex-1 border-b-[1.4px] px-0 py-1.5 text-center text-[14px] leading-[1.6] font-medium text-indigo-200',
                    activeTab === tab && 'text-primary-500 border-blue-200 font-bold',
                    activeTab !== tab && 'border-transparent'
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className={cn('min-h-0 flex-1 overflow-hidden px-5', isPending && 'opacity-60 transition-opacity')}>
              <RankingList
                type={TAB_TO_TYPE[activeTab]}
                sort={sort}
                sheetPosition={position}
                hiddenBottomInsetPx={bottomInsetPx}
                autoExpandResetKey={autoExpandResetKey}
                onRequestExpand={() => setSheetPosition('full')}
              />
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}

export default TimerPage;
