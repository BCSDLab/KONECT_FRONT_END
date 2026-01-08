import { useSearchParams } from 'react-router-dom';
import { dateUtils } from '@/utils/hooks/useSchedule';
import DateBox from './components/DateBox';
import MonthPicker from './components/MonthPicker';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function Schedule() {
  const [searchParams, setSearchParams] = useSearchParams();

  const year = searchParams.get('year') || new Date().getFullYear();
  const month = searchParams.get('month') || new Date().getMonth() + 1;
  const day = searchParams.get('day') || new Date().getDate();

  const { isCurrentMonth, isSelectedDay, isSunday, getMonthDateList } = dateUtils(
    Number(year),
    Number(month),
    Number(day)
  );

  const dateList = getMonthDateList();

  const handleDateClick = (date: Date) => {
    setSearchParams({
      year: String(date.getFullYear()),
      month: String(date.getMonth() + 1),
      day: String(date.getDate()),
    });
  };

  const setDate = (year?: number, month?: number) => {
    const nextYear = year ?? new Date().getFullYear();
    const nextMonth = month ?? new Date().getMonth() + 1;

    setSearchParams({
      year: String(nextYear),
      month: String(nextMonth),
      day: '1',
    });
  };

  return (
    <>
      <main className="flex w-full flex-col gap-6 bg-white">
        <header className="flex justify-center gap-5">
          <MonthPicker year={Number(year)} month={Number(month)} setDate={setDate} />
        </header>
        <ul className="text-label-1-b grid grid-cols-7 justify-items-center gap-[20px] px-6 text-indigo-600">
          {DAYS.map((day) => (
            <li key={day}>{day}</li>
          ))}
        </ul>

        <ul className="grid grid-cols-7 gap-[20px] px-6">
          {dateList.map((date: Date) => (
            <DateBox
              key={date.toISOString()}
              date={date}
              isCurrentMonth={isCurrentMonth(date)}
              isToday={isSelectedDay(date)}
              isSunday={isSunday(date)}
              onClick={() => handleDateClick(date)}
            />
          ))}
        </ul>
      </main>
    </>
  );
}

export default Schedule;
