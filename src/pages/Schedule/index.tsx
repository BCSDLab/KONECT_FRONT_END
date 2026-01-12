import { useSearchParams } from 'react-router-dom';
import { dateUtils } from '@/utils/hooks/useSchedule';
import DateBox from './components/DateBox';
import MonthPicker from './components/MonthPicker';
import ScheduleDetail from './ScheduleDetail';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type MockSchedule = {
  title: string;
  startedAt: string;
  endedAt: string;
  scheduleCategory: 'UNIVERSITY' | 'CLUB' | 'COUNCIL';
};

const isOverlapping = (aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) => {
  return aStart <= bEnd && bStart <= aEnd;
};

type LaneUsage = {
  lane: number;
  start: Date;
  end: Date;
};

const MOCK_SCHEDULES: MockSchedule[] = [
  {
    title: '동아리 회의',
    startedAt: '2026.09.12 00:00',
    endedAt: '2026.09.12 00:00',
    scheduleCategory: 'CLUB',
  },
  {
    title: '총학 행사',
    startedAt: '2026.09.12 00:00',
    endedAt: '2026.09.14 00:00',
    scheduleCategory: 'COUNCIL',
  },
  {
    title: '대학교 축제',
    startedAt: '2026.09.11 00:00',
    endedAt: '2026.09.13 00:00',
    scheduleCategory: 'UNIVERSITY',
  },
  {
    title: '동아리 축제',
    startedAt: '2026.09.21 00:00',
    endedAt: '2026.09.21 00:00',
    scheduleCategory: 'CLUB',
  },

  {
    title: '중간고사 기간',
    startedAt: '2026.09.28 00:00',
    endedAt: '2026.09.29 00:00',
    scheduleCategory: 'UNIVERSITY',
  },
  {
    title: '총학 회의',
    startedAt: '2026.09.28 00:00',
    endedAt: '2026.09.29 00:00',
    scheduleCategory: 'COUNCIL',
  },
];

/* =======================
공통유틸
======================= */
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

type SchedulePosition = 'single' | 'start' | 'middle' | 'end';

const getSchedulePosition = (date: Date, startedAt: string, endedAt: string): SchedulePosition => {
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const start = toDateOnly(startedAt);
  const end = toDateOnly(endedAt);

  if (start.getTime() === end.getTime()) return 'single';
  if (target.getTime() === start.getTime()) return 'start';
  if (target.getTime() === end.getTime()) return 'end';
  return 'middle';
};

type ScheduleWithLane = MockSchedule & { lane: number };
const assignLanes = (schedules: MockSchedule[]): ScheduleWithLane[] => {
  const sorted = schedules.slice().sort((a, b) => {
    const aStart = toDateOnly(a.startedAt);
    const bStart = toDateOnly(b.startedAt);
    return aStart.getTime() - bStart.getTime();
  });

  const lanes: LaneUsage[] = [];

  return sorted.map((schedule) => {
    const start = toDateOnly(schedule.startedAt);
    const end = toDateOnly(schedule.endedAt);

    // 🔍 비어 있는 lane 찾기
    let assignedLane = lanes.find((l) => !isOverlapping(l.start, l.end, start, end));

    if (!assignedLane) {
      // 없으면 새 lane 생성
      assignedLane = { lane: lanes.length, start, end };
      lanes.push(assignedLane);
    } else {
      // 있으면 기간 갱신
      assignedLane.start = start;
      assignedLane.end = end;
    }

    return {
      ...schedule,
      lane: assignedLane.lane,
    };
  });
};

const SCHEDULES_WITH_LANE = assignLanes(MOCK_SCHEDULES);

/* ======================================= */
function Schedule() {
  const [searchParams, setSearchParams] = useSearchParams();

  const year = Number(searchParams.get('year') || new Date().getFullYear());
  const month = Number(searchParams.get('month') || new Date().getMonth() + 1);
  const day = Number(searchParams.get('day') || new Date().getDate());

  const { isCurrentMonth, isSelectedDay, isSunday, getMonthDateList } = dateUtils(year, month, day);

  const dateList = getMonthDateList();

  const handleDateClick = (date: Date) => {
    setSearchParams({
      year: String(date.getFullYear()),
      month: String(date.getMonth() + 1),
      day: String(date.getDate()),
    });
  };

  const setDate = (year?: number, month?: number) => {
    setSearchParams({
      year: String(year ?? new Date().getFullYear()),
      month: String(month ?? new Date().getMonth() + 1),
      day: '1',
    });
  };

  const schedulesByDate = (date: Date) =>
    SCHEDULES_WITH_LANE.filter((s) => isDateInRange(date, s.startedAt, s.endedAt)).map((s) => ({
      ...s,
      position: getSchedulePosition(date, s.startedAt, s.endedAt),
    }));

  return (
    <div>
      <main className="flex w-full flex-col gap-6 bg-white">
        <header className="flex justify-center gap-5">
          <MonthPicker year={year} month={month} setDate={setDate} />
        </header>

        <ul className="grid grid-cols-7 justify-items-center px-6 text-indigo-600">
          {DAYS.map((day) => (
            <li key={day}>{day}</li>
          ))}
        </ul>

        <ul className="grid grid-cols-7 gap-x-[6px] gap-y-3 px-6">
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

      <ScheduleDetail month={month} day={day} />
    </div>
  );
}

export default Schedule;
