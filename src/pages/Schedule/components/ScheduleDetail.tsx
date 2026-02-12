import CalendarIcon from '@/assets/svg/calendar.svg';
import { formatScheduleTime } from '@/utils/hooks/useFormatTime';
import { useScheduleList } from '../hooks/useGetSchedules';

type scheduleDetailProps = {
  year: number;
  month: number;
  day: number;
};

const SCHEDULE_COLOR = {
  UNIVERSITY: '#AEDCBA',
  CLUB: '#FDE49B',
  COUNCIL: '#E9F2FA',
  DORM: '#B9ADEF',
};

function ScheduleDetail({ year, month, day }: scheduleDetailProps) {
  const { data: schedules } = useScheduleList({ year, month });

  const parseDateOnly = (value: string) => {
    const [date] = value.split(' ');
    const [year, month, day] = date.split('.').map(Number);
    return new Date(year, month - 1, day);
  };

  const dailySchedules = schedules?.schedules?.filter(({ startedAt, endedAt }) => {
    const target = new Date(new Date().getFullYear(), month - 1, day);

    const start = parseDateOnly(startedAt);
    const end = parseDateOnly(endedAt);

    return start <= target && target <= end;
  });

  return (
    <div className="flex flex-1 flex-col gap-2 bg-white px-6 pb-6">
      <span className="text-[14px] leading-4 font-semibold">
        {month}월 {day}일 일정 상세보기
      </span>
      {dailySchedules?.length ? (
        dailySchedules.map(({ title, startedAt, endedAt, scheduleCategory }) => (
          <div
            className="flex items-center gap-3 self-stretch rounded-lg border border-[#F4F6F9] bg-white p-3"
            key={title}
          >
            <div
              className="flex h-10 w-10 items-center justify-center rounded-sm"
              style={{ backgroundColor: SCHEDULE_COLOR[scheduleCategory] }}
            >
              <CalendarIcon style={{ color: '#fff' }} />
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-[14px] leading-4 font-bold">{title}</div>
              <div className="text-[13px] leading-3 text-indigo-300">{formatScheduleTime({ startedAt, endedAt })}</div>
            </div>
          </div>
        ))
      ) : (
        <div className="flex h-34 items-center justify-center gap-3 self-stretch rounded-lg border border-[#F4F6F9] bg-white p-3">
          <div className="text-[15px] leading-[17px] font-bold text-indigo-200">일정이 없습니다!</div>
        </div>
      )}
    </div>
  );
}

export default ScheduleDetail;
