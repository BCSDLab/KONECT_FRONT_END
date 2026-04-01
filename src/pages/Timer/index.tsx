import { useEffect, useRef, useState, useTransition } from 'react';
import type { StudyRankingParams } from '@/apis/studyTime/entity';
import BottomSheet from '@/components/common/BottomSheet';
import Dropdown from '@/components/common/Dropdown';
import { useLayoutElementsContext } from '@/contexts/useLayoutElementsContext';
import { cn } from '@/utils/ts/cn';
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

function getBottomInsetPx(bottomOverlayInset: string) {
  const matchedInset = bottomOverlayInset.match(/(\d+(?:\.\d+)?)px/);

  return matchedInset ? Number.parseFloat(matchedInset[1]) : 80;
}

function getViewportHeight() {
  return window.visualViewport?.height ?? window.innerHeight;
}

function getViewportWidth() {
  return window.visualViewport?.width ?? window.innerWidth;
}

function TimerPage() {
  const { todayAccumulatedSeconds, sessionStartMs, isRunning, toggle, isStarting, isStopping } = useStudyTimer();
  const { bottomOverlayInset } = useLayoutElementsContext();
  const timerSectionRef = useRef<HTMLDivElement>(null);

  const [isPending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<TabType>('개인');
  const [sort, setSort] = useState<StudyRankingParams['sort']>('MONTHLY');
  const [viewportHeight, setViewportHeight] = useState(() => getViewportHeight());
  const [viewportWidth, setViewportWidth] = useState(() => getViewportWidth());
  const [timerSectionTop, setTimerSectionTop] = useState(0);

  const tabs: TabType[] = ['동아리', '학번', '개인'];
  const isBusy = isStarting || isStopping;
  const bottomInsetPx = getBottomInsetPx(bottomOverlayInset);
  const halfSheetHeight = Math.max(220, Math.round((viewportHeight - 105 - bottomInsetPx) * 0.45));
  const preferredTimerSize = Math.min(312, viewportWidth - 48);
  const availableTimerHeight = viewportHeight - bottomInsetPx - halfSheetHeight - timerSectionTop - 16;
  const timerSize = Math.max(0, Math.min(preferredTimerSize, availableTimerHeight));

  useEffect(() => {
    const updateLayout = () => {
      setViewportHeight(getViewportHeight());
      setViewportWidth(getViewportWidth());
      setTimerSectionTop(timerSectionRef.current?.getBoundingClientRect().top ?? 0);
    };

    updateLayout();

    window.addEventListener('resize', updateLayout);
    window.visualViewport?.addEventListener('resize', updateLayout);

    return () => {
      window.removeEventListener('resize', updateLayout);
      window.visualViewport?.removeEventListener('resize', updateLayout);
    };
  }, []);

  return (
    <div className="relative min-h-full overflow-hidden bg-[#f4f6f9] pt-5">
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
        bottomOffset={bottomOverlayInset}
        halfTopOffset={105}
        halfHeight={halfSheetHeight}
        fullTopOffset={80}
      >
        {() => (
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
                    activeTab === tab && 'border-[#8EC2FC] font-bold text-[#69BFDF]',
                    activeTab !== tab && 'border-transparent'
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className={cn('min-h-0 flex-1 overflow-hidden px-5', isPending && 'opacity-60 transition-opacity')}>
              <RankingList type={TAB_TO_TYPE[activeTab]} sort={sort} />
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}

export default TimerPage;
