import { useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { scheduleQueries } from '@/apis/schedule/queries';
import Portal from '@/components/common/Portal';
import { SCHEDULE_DAYS } from '@/constants/schedule';
import { dateUtils } from '@/utils/hooks/useSchedule';
import CalendarWeekRow from './components/CalendarWeekRow';
import ScheduleDetail from './components/ScheduleDetail';
import { useMonthSwipe } from './hooks/useMonthSwipe';

const COLOR_LEGENDS = [
  { name: '총동아리', color: '#E9F2FA' },
  { name: '공휴일', color: '#FFB8B8' },
  { name: '동아리', color: '#FDE49B' },
  { name: '학사일정', color: '#AEDCBA' },
  { name: '기숙사', color: '#B9ADEF' },
];

const HEADER_HEIGHT = 44;
const PEEK_HEIGHT = 150;
const SHEET_TOP_OFFSET = HEADER_HEIGHT + 200;

function Schedule() {
  const [searchParams, setSearchParams] = useSearchParams();

  const year = Number(searchParams.get('year') || new Date().getFullYear());
  const month = Number(searchParams.get('month') || new Date().getMonth() + 1);
  const day = Number(searchParams.get('day') || new Date().getDate());

  const { data } = useQuery({
    ...scheduleQueries.monthly({ year, month }),
    enabled: Number.isFinite(year) && Number.isFinite(month) && month >= 1 && month <= 12,
  });

  const { isCurrentMonth, isSelectedDay, isSunday, getMonthDateList } = dateUtils(year, month, day);

  const dateList = getMonthDateList();

  const schedules = useMemo(() => data?.schedules ?? [], [data?.schedules]);

  const weeks = useMemo(() => {
    const result: Date[][] = [];
    for (let i = 0; i < dateList.length; i += 7) {
      result.push(dateList.slice(i, i + 7));
    }
    return result;
  }, [dateList]);

  const [isSheetExpanded, setIsSheetExpanded] = useState(searchParams.get('sheet') === '1');
  const sheetTouchStartY = useRef(0);

  const handleSheetTouchStart = (e: React.TouchEvent) => {
    sheetTouchStartY.current = e.touches[0].clientY;
  };

  const handleSheetTouchEnd = (e: React.TouchEvent) => {
    const delta = sheetTouchStartY.current - e.changedTouches[0].clientY;
    if (delta > 40) setIsSheetExpanded(true);
    else if (delta < -40) setIsSheetExpanded(false);
  };

  const handleDateClick = (date: Date) => {
    setSearchParams(
      {
        year: String(date.getFullYear()),
        month: String(date.getMonth() + 1),
        day: String(date.getDate()),
      },
      { replace: true }
    );
    setIsSheetExpanded(true);
  };

  const setDate = (year?: number, month?: number) => {
    setSearchParams(
      {
        year: String(year ?? new Date().getFullYear()),
        month: String(month ?? new Date().getMonth() + 1),
        day: '1',
      },
      { replace: true }
    );
    setIsSheetExpanded(false);
  };

  const { handleTouchStart, handleTouchEnd } = useMonthSwipe({
    year,
    month,
    onChange: setDate,
  });

  return (
    <div className="relative flex h-[calc(var(--viewport-height)-44px)] flex-col overflow-hidden bg-white">
      <div className="overflow-y-auto" style={{ maxHeight: `calc(100% - ${PEEK_HEIGHT}px)` }}>
        <main
          className="flex w-full shrink-0 touch-pan-y flex-col bg-white pt-5.75"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <ul className="grid grid-cols-7 justify-items-center px-6 text-indigo-600">
            {SCHEDULE_DAYS.map((day) => (
              <li key={day} className="text-[13px] leading-5">
                {day}
              </li>
            ))}
          </ul>

          <div className="flex flex-col px-6">
            {weeks.map((weekDates) => (
              <CalendarWeekRow
                key={weekDates[0].toISOString()}
                dates={weekDates}
                schedules={schedules}
                isCurrentMonth={isCurrentMonth}
                isSelectedDay={isSelectedDay}
                isSunday={isSunday}
                onDateClick={handleDateClick}
              />
            ))}
          </div>
        </main>

        <ul className="text-cap2 flex shrink-0 gap-3 overflow-x-auto px-6 py-3 font-medium text-[#4B5563]">
          {COLOR_LEGENDS.map(({ name, color }) => (
            <li key={name} className="flex shrink-0 items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
              {name}
            </li>
          ))}
        </ul>
      </div>

      <Portal>
        <>
          <div
            className={`fixed inset-0 z-31 bg-black/40 transition-opacity duration-300 ${isSheetExpanded ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
            onClick={() => setIsSheetExpanded(false)}
          />

          <section
            className="fixed inset-x-0 bottom-0 z-32 flex flex-col rounded-t-3xl bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.06)] transition-transform duration-300 ease-out"
            style={{
              height: `calc(var(--viewport-height) - ${SHEET_TOP_OFFSET}px)`,
              transform: isSheetExpanded ? 'translateY(0)' : `translateY(calc(100% - ${PEEK_HEIGHT}px))`,
            }}
          >
            <div
              className="flex shrink-0 justify-center pt-3 pb-2"
              onTouchStart={handleSheetTouchStart}
              onTouchEnd={handleSheetTouchEnd}
            >
              <div className="h-1 w-8 rounded-full bg-[#D1D5DB]" />
            </div>

            <div className="flex flex-1 flex-col overflow-hidden">
              <ScheduleDetail
                year={year}
                month={month}
                day={day}
                schedules={schedules}
                onItemClick={() => setIsSheetExpanded(true)}
              />
            </div>
          </section>
        </>
      </Portal>
    </div>
  );
}

export default Schedule;
