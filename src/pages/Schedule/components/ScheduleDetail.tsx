import { useEffect, useMemo, useRef } from 'react';
import type { Schedule } from '@/apis/schedule/entity';
import { SCHEDULE_COLOR } from '@/constants/schedule';
import { formatScheduleTime } from '@/utils/hooks/useFormatTime';
import { cn } from '@/utils/ts/cn';
import { parseDateDot } from '@/utils/ts/datetime/date';

type ScheduleDetailProps = {
  year: number;
  month: number;
  day: number;
  schedules: Schedule[];
  onItemClick?: () => void;
};

function ScheduleDetail({ year, month, day, schedules, onItemClick }: ScheduleDetailProps) {
  const selectedDate = useMemo(() => new Date(year, month - 1, day), [year, month, day]);

  const sortedSchedules = useMemo(
    () => [...schedules].sort((a, b) => parseDateDot(a.startedAt).getTime() - parseDateDot(b.startedAt).getTime()),
    [schedules]
  );

  const isOnSelectedDay = (startedAt: string, endedAt: string) => {
    const start = parseDateDot(startedAt);
    const end = parseDateDot(endedAt);
    return start <= selectedDate && selectedDate <= end;
  };

  const firstHighlightedIndex = sortedSchedules.findIndex(({ startedAt, endedAt }) =>
    isOnSelectedDay(startedAt, endedAt)
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const firstHighlightedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!firstHighlightedRef.current || !containerRef.current) return;
    const el = firstHighlightedRef.current;
    const container = containerRef.current;
    const top = el.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop;
    container.scrollTo({ top, behavior: 'smooth' });
  }, [day, month, year, firstHighlightedIndex]);

  return (
    <div ref={containerRef} className="flex flex-1 flex-col gap-2 overflow-y-auto bg-white px-6 pt-4 pb-6">
      {sortedSchedules.length ? (
        sortedSchedules.map(({ title, startedAt, endedAt, scheduleCategory }, index) => {
          const highlighted = isOnSelectedDay(startedAt, endedAt);
          return (
            <div
              ref={index === firstHighlightedIndex ? firstHighlightedRef : undefined}
              key={title + startedAt}
              className={cn(
                'border-indigo-5 flex h-17.5 shrink-0 cursor-pointer items-stretch self-stretch overflow-hidden rounded-lg border bg-white transition-opacity',
                !highlighted && 'opacity-40'
              )}
              onClick={onItemClick}
            >
              <div className="w-1 shrink-0" style={{ backgroundColor: SCHEDULE_COLOR[scheduleCategory] }} />
              <div className="flex flex-col gap-1 p-3">
                <div className={`text-[16px] leading-5 font-semibold ${highlighted ? 'text-black' : 'text-gray-500'}`}>
                  {title}
                </div>
                <div className={`text-[14px] leading-4 ${highlighted ? 'text-indigo-300' : 'text-gray-400'}`}>
                  {formatScheduleTime({ startedAt, endedAt })}
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="border-indigo-5 flex h-34 items-center justify-center gap-3 self-stretch rounded-lg border bg-white p-3">
          <div className="text-[15px] leading-4.25 font-bold text-indigo-200">일정이 없습니다!</div>
        </div>
      )}
    </div>
  );
}

export default ScheduleDetail;
