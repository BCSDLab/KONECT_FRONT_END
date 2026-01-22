import { useSearchParams } from 'react-router-dom';
import { dateUtils } from '@/utils/hooks/useSchedule';
import DateBox from './components/DateBox';
import MonthPicker from './components/MonthPicker';
import { useScheduleList } from './hooks/useGetSchedules';
import ScheduleDetail from './ScheduleDetail';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type Schedule = {
  title: string;
  startedAt: string;
  endedAt: string;
  scheduleCategory: 'UNIVERSITY' | 'CLUB' | 'COUNCIL' | 'DORM';
};

const toDateOnly = (value: string) => {
  const [d] = value.split(' ');
  const [y, m, day] = d.split('.').map(Number);
  return new Date(y, m - 1, day);
};

const isDateInRange = (date: Date, startedAt: string, endedAt: string) => {
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const start = toDateOnly(startedAt);
  const end = toDateOnly(endedAt);
  return start <= target && target <= end;
};

function Schedule() {
  const [searchParams, setSearchParams] = useSearchParams();

  const year = Number(searchParams.get('year') || new Date().getFullYear());
  const month = Number(searchParams.get('month') || new Date().getMonth() + 1);
  const day = Number(searchParams.get('day') || new Date().getDate());

  const { data } = useScheduleList({ year, month });
  const schedules: Schedule[] = data?.schedules ?? [];

  const { isCurrentMonth, isSelectedDay, isSunday, getMonthDateList } = dateUtils(year, month, day);

  const dateList = getMonthDateList();

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
  const schedulesByDate = (date: Date): Schedule[] => {
    return schedules.filter((s) => isDateInRange(date, s.startedAt, s.endedAt));
  };

  return (
    <div className="flex h-[calc(100vh-44px)] flex-col bg-white">
      <main className="flex w-full shrink-0 flex-col gap-6 bg-white">
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
              schedules={schedulesByDate(date)}
            />
          ))}
        </ul>
      </main>

      <section className="flex-1 overflow-y-auto">
        <ScheduleDetail month={month} day={day} />
      </section>
    </div>
  );
}

export default Schedule;
