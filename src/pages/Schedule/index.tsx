import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { dateUtils } from '@/utils/hooks/useSchedule';
import CalendarWeekRow from './components/CalendarWeekRow';
import MonthPicker from './components/MonthPicker';
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
  };

  const { handleTouchStart, handleTouchEnd } = useMonthSwipe({
    year,
    month,
    onChange: setDate,
  });

  return (
    <div className="flex h-[calc(100vh-44px)] flex-col bg-white">
      <main
        className="flex w-full shrink-0 touch-pan-y flex-col bg-white"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <header className="flex items-center justify-center pb-5">
          <MonthPicker year={year} month={month} setDate={setDate} />
        </header>

        <ul className="grid grid-cols-7 justify-items-center px-6 text-indigo-600">
          {DAYS.map((day) => (
            <li key={day}>{day}</li>
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

      <ul className="text-cap2 flex gap-3 overflow-x-auto px-6 py-3 font-medium text-[#4B5563]">
        {COLOR_LEGENDS.map(({ name, color }) => (
          <li key={name} className="flex shrink-0 items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
            {name}
          </li>
        ))}
      </ul>

      <div className="h-[0.7px] bg-[#D6DAE0]"></div>
      <section className="flex-1 overflow-y-auto">
        <ScheduleDetail year={year} month={month} day={day} />
      </section>
    </div>
  );
}

export default Schedule;
