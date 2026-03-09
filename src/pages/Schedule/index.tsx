import { useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { dateUtils } from '@/utils/hooks/useSchedule';
import CalendarWeekRow from './components/CalendarWeekRow';
import ScheduleDetail from './components/ScheduleDetail';
import { useScheduleList } from './hooks/useGetSchedules';
import { useMonthSwipe } from './hooks/useMonthSwipe';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const COLOR_LEGENDS = [
  { name: '총동아리', color: '#E9F2FA' },
  { name: '공휴일', color: '#FFB8B8' },
  { name: '동아리', color: '#FDE49B' },
  { name: '학사일정', color: '#AEDCBA' },
  { name: '기숙사', color: '#B9ADEF' },
];

const PEEK_HEIGHT = 150;

function Schedule() {
  const [searchParams, setSearchParams] = useSearchParams();

  const year = Number(searchParams.get('year') || new Date().getFullYear());
  const month = Number(searchParams.get('month') || new Date().getMonth() + 1);
  const day = Number(searchParams.get('day') || new Date().getDate());

  const { data } = useScheduleList({ year, month });

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

  const [isSheetExpanded, setIsSheetExpanded] = useState(false);
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
    <div className="relative flex h-[calc(100vh-44px)] flex-col overflow-hidden bg-white">
      <main
        className="flex w-full shrink-0 touch-pan-y flex-col bg-white pt-[23px]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <ul className="grid grid-cols-7 justify-items-center px-6 text-indigo-600">
          {DAYS.map((day) => (
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

      <ul className="text-caption2 flex shrink-0 gap-3 overflow-x-auto px-6 py-3 font-medium text-[#4B5563]">
        {COLOR_LEGENDS.map(({ name, color }) => (
          <li key={name} className="flex shrink-0 items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
            {name}
          </li>
        ))}
      </ul>

      {/* 바텀시트 */}
      <section
        className="absolute inset-x-0 bottom-0 z-10 flex flex-col rounded-t-3xl bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.06)] transition-transform duration-300 ease-out"
        style={{
          height: `calc(100% - 200px)`,
          transform: isSheetExpanded ? 'translateY(0)' : `translateY(calc(100% - ${PEEK_HEIGHT}px))`,
        }}
      >
        {/* 핸들 */}
        <div
          className="flex shrink-0 justify-center pt-3 pb-2"
          onTouchStart={handleSheetTouchStart}
          onTouchEnd={handleSheetTouchEnd}
        >
          <div className="h-1 w-8 rounded-full bg-[#D1D5DB]" />
        </div>

        <div className="flex flex-1 flex-col overflow-hidden">
          <ScheduleDetail year={year} month={month} day={day} />
        </div>
      </section>
    </div>
  );
}

export default Schedule;
