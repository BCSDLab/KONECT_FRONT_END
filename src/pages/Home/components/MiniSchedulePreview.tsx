import { useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { scheduleQueries } from '@/apis/schedule/queries';
import { SCHEDULE_DAYS } from '@/constants/schedule';
import CalendarWeekRow from '@/pages/Schedule/components/CalendarWeekRow';
import { dateUtils } from '@/utils/hooks/useSchedule';

export function MiniSchedulePreviewSkeleton() {
  return (
    <div className="h-[193px] rounded-[20px] bg-white p-3 shadow-[0_0_3px_rgba(0,0,0,0.2)]">
      <div className="grid grid-cols-7 gap-2">
        {SCHEDULE_DAYS.map((day) => (
          <div key={day} className="bg-indigo-25 h-5 rounded" />
        ))}
      </div>
      <div className="mt-4 space-y-3">
        <div className="bg-indigo-25 h-18 rounded-xl" />
        <div className="bg-indigo-25 h-18 rounded-xl" />
      </div>
    </div>
  );
}

export function MiniSchedulePreviewErrorFallback() {
  return (
    <div className="flex h-[193px] items-center justify-center rounded-[20px] bg-white px-4 text-center shadow-[0_0_3px_rgba(0,0,0,0.2)]">
      <span className="text-sub2 text-indigo-300">일정을 불러오는 중 오류가 발생했어요</span>
    </div>
  );
}

function MiniSchedulePreview() {
  const navigate = useNavigate();

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  const { data } = useSuspenseQuery(scheduleQueries.monthly({ year, month }));
  const { isCurrentMonth, isSelectedDay, isSunday, getMonthDateList } = dateUtils(year, month, day);

  const dateList = getMonthDateList();
  const weeks: Date[][] = [];

  for (let index = 0; index < dateList.length; index += 7) {
    weeks.push(dateList.slice(index, index + 7));
  }

  const todayWeekIndex = weeks.findIndex((week) =>
    week.some((date) => date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day)
  );
  const visibleWeeks = todayWeekIndex >= 0 ? weeks.slice(todayWeekIndex, todayWeekIndex + 2) : weeks.slice(0, 2);

  const handleDateClick = (date: Date) => {
    navigate(`/schedule?year=${date.getFullYear()}&month=${date.getMonth() + 1}&day=${date.getDate()}&sheet=1`);
  };

  return (
    <div className="overflow-hidden rounded-[20px] bg-white px-3 pt-3 shadow-[0_0_3px_rgba(0,0,0,0.2)]">
      <ul className="grid grid-cols-7 justify-items-center text-center text-[13px] leading-5 font-bold text-indigo-600">
        {SCHEDULE_DAYS.map((dayLabel) => (
          <li key={dayLabel}>{dayLabel}</li>
        ))}
      </ul>

      <div className="mt-1">
        {visibleWeeks.map((weekDates) => (
          <CalendarWeekRow
            key={weekDates[0].toISOString()}
            dates={weekDates}
            schedules={data.schedules}
            isCurrentMonth={isCurrentMonth}
            isSelectedDay={isSelectedDay}
            isSunday={isSunday}
            onDateClick={handleDateClick}
          />
        ))}
      </div>
    </div>
  );
}

export default MiniSchedulePreview;
