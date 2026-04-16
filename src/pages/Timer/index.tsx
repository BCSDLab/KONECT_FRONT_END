import { useDeferredValue, useMemo, useRef, useState } from 'react';
import type { StudyRankingParams } from '@/apis/studyTime/entity';
import BottomSheet, { type SheetPosition } from '@/components/common/BottomSheet';
import Dropdown from '@/components/common/Dropdown';
import Modal from '@/components/common/Modal';
import { useLayoutElementsContext } from '@/contexts/useLayoutElementsContext';
import RankingList from '@/pages/Timer/components/RankingList';
import TimerButton from '@/pages/Timer/components/TimerButton';
import { useStudyTimer } from '@/pages/Timer/hooks/useStudyTimer';
import { useTimerExitGuard } from '@/pages/Timer/hooks/useTimerExitGuard';
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
  const { todayAccumulatedSeconds, sessionStartMs, isRunning, toggle, stop, isStarting, isStopping } = useStudyTimer();
  const { bottomOverlayInsetPx } = useLayoutElementsContext();
  const timerSectionRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<TabType>('개인');
  const [sort, setSort] = useState<StudyRankingParams['sort']>('MONTHLY');
  const rankingParams = useMemo(
    () => ({
      activeTab,
      sort,
    }),
    [activeTab, sort]
  );
  const deferredRankingParams = useDeferredValue(rankingParams);
  const [sheetPosition, setSheetPosition] = useState<SheetPosition>('half');
  const [autoExpandResetKey, setAutoExpandResetKey] = useState(0);
  const { isExitConfirmOpen, closeExitConfirm, confirmExit } = useTimerExitGuard({ isRunning, stop });

  const tabs: TabType[] = ['동아리', '학번', '개인'];
  const isBusy = isStarting || isStopping;
  const isRankingPending = activeTab !== deferredRankingParams.activeTab || sort !== deferredRankingParams.sort;
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
      <div ref={timerSectionRef} className={cn('relative mx-auto w-full max-w-97.5 px-6', isRunning ? 'z-40' : 'z-10')}>
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

      {isRunning && <div aria-hidden className="fixed inset-0 z-30 bg-black/70" />}

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
              <Dropdown className="absolute top-0 right-5" options={SORT_OPTIONS} value={sort} onChange={setSort} />
            </div>

            <div className="mt-2.5 flex w-full shrink-0 items-center justify-between">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
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

            <div
              className={cn('min-h-0 flex-1 overflow-hidden px-5', isRankingPending && 'opacity-60 transition-opacity')}
            >
              <RankingList
                type={TAB_TO_TYPE[deferredRankingParams.activeTab]}
                sort={deferredRankingParams.sort}
                sheetPosition={position}
                hiddenBottomInsetPx={bottomInsetPx}
                autoExpandResetKey={autoExpandResetKey}
                onRequestExpand={() => setSheetPosition('full')}
              />
            </div>
          </div>
        )}
      </BottomSheet>

      <Modal isOpen={isExitConfirmOpen} onClose={closeExitConfirm} className="rounded-2xl px-4 py-5">
        <div className="text-text-700 flex flex-col gap-5 text-center text-[15px] leading-[1.6]">
          <p className="font-semibold">타이머 종료</p>
          <p className="font-medium">타이머를 종료하고 페이지를 이동할까요?</p>
          <div className="flex gap-2 text-[15px] leading-5.5 font-bold">
            <button
              type="button"
              className="border-primary-500 text-primary-500 flex-1 cursor-pointer rounded-[10px] border py-2.75"
              onClick={closeExitConfirm}
              disabled={isStopping}
            >
              취소
            </button>
            <button
              type="button"
              className="bg-primary-500 border-primary-500 flex-1 cursor-pointer rounded-[10px] border text-white disabled:opacity-60"
              onClick={() => void confirmExit()}
              disabled={isStopping}
            >
              종료
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default TimerPage;
