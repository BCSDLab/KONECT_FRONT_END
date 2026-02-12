import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { dateUtils } from '@/utils/hooks/useSchedule';
import DateBox from './components/DateBox';
import MonthPicker from './components/MonthPicker';
import ScheduleDetail from './components/ScheduleDetail';
import { useScheduleList } from './hooks/useGetSchedules';
import { useMonthSwipe } from './hooks/useMonthSwipe';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type Schedule = {
  title: string;
  startedAt: string;
  endedAt: string;
  scheduleCategory: 'UNIVERSITY' | 'CLUB' | 'COUNCIL' | 'DORM';
};

const toDateKey = (date: Date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

const parseDate = (value: string) => {
  const [d] = value.split(' ');
  const [y, m, day] = d.split('.').map(Number);
  return new Date(y, m - 1, day);
};

function buildScheduleMap(schedules: Schedule[]): Map<string, Schedule[]> {
  const map = new Map<string, Schedule[]>();

  for (const schedule of schedules) {
    const start = parseDate(schedule.startedAt);
    const end = parseDate(schedule.endedAt);

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const key = toDateKey(d);
      const existing = map.get(key);
      if (existing) {
        existing.push(schedule);
      } else {
        map.set(key, [schedule]);
      }
    }
  }

  return map;
}

function Schedule() {
  const [searchParams, setSearchParams] = useSearchParams();

  const year = Number(searchParams.get('year') || new Date().getFullYear());
  const month = Number(searchParams.get('month') || new Date().getMonth() + 1);
  const day = Number(searchParams.get('day') || new Date().getDate());

  const { data } = useScheduleList({ year, month });

  const { isCurrentMonth, isSelectedDay, isSunday, getMonthDateList } = dateUtils(year, month, day);

  const dateList = getMonthDateList();

  // 스케줄을 날짜별로 미리 인덱싱 (O(n*m) -> O(1) 조회)
  const scheduleMap = useMemo(() => buildScheduleMap(data?.schedules ?? []), [data?.schedules]);

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

  const getSchedulesForDate = (date: Date): Schedule[] => {
    return scheduleMap.get(toDateKey(date)) ?? [];
  };

  const { handleTouchStart, handleTouchEnd } = useMonthSwipe({
    year,
    month,
    onChange: setDate,
  });

  return (
    <div className="flex h-[calc(100vh-44px)] flex-col bg-white">
      <main
        className="flex w-full shrink-0 touch-pan-y flex-col gap-6 bg-white"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <header className="flex items-center justify-center">
          <MonthPicker year={year} month={month} setDate={setDate} />
        </header>

        <ul className="grid grid-cols-7 justify-items-center px-6 text-indigo-600">
          {DAYS.map((day) => (
            <li key={day}>{day}</li>
          ))}
        </ul>

        <ul className="grid grid-cols-7 gap-x-1.5 gap-y-3 px-6">
          {dateList.map((date) => (
            <DateBox
              key={date.toISOString()}
              date={date}
              isCurrentMonth={isCurrentMonth(date)}
              isToday={isSelectedDay(date)}
              isSunday={isSunday(date)}
              onClick={handleDateClick}
              schedules={getSchedulesForDate(date)}
            />
          ))}
        </ul>
      </main>

      <section className="flex-1 overflow-y-auto">
        <ScheduleDetail year={year} month={month} day={day} />
      </section>
    </div>
  );
}

export default Schedule;
