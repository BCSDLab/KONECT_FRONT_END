import type { Schedule } from '@/apis/schedule/entity';
import { SCHEDULE_COLOR } from '@/constants/schedule';
import { parseDateDot } from '@/utils/ts/datetime/date';
import DateBox from './DateBox';

const BAR_HEIGHT = 13;
const BAR_ROW_GAP = 3;
const MAX_VISIBLE_LANES = 2;

type BarItem = {
  schedule: Schedule;
  startCol: number;
  endCol: number;
  lane: number;
};

function layoutBars(weekDates: Date[], schedules: Schedule[], isCurrentMonth: (date: Date) => boolean): BarItem[] {
  const currentMonthDates = weekDates.filter(isCurrentMonth);
  if (currentMonthDates.length === 0) return [];

  const wsMonth = new Date(
    currentMonthDates[0].getFullYear(),
    currentMonthDates[0].getMonth(),
    currentMonthDates[0].getDate()
  ).getTime();
  const weMonth = new Date(
    currentMonthDates[currentMonthDates.length - 1].getFullYear(),
    currentMonthDates[currentMonthDates.length - 1].getMonth(),
    currentMonthDates[currentMonthDates.length - 1].getDate()
  ).getTime();

  const overlapping = schedules.filter((s) => {
    const start = parseDateDot(s.startedAt).getTime();
    const end = parseDateDot(s.endedAt).getTime();
    return start <= weMonth && end >= wsMonth;
  });

  overlapping.sort((a, b) => parseDateDot(a.startedAt).getTime() - parseDateDot(b.startedAt).getTime());

  const bars: BarItem[] = [];
  const laneEndCols: number[] = [];

  for (const schedule of overlapping) {
    const startMs = parseDateDot(schedule.startedAt).getTime();
    const endMs = parseDateDot(schedule.endedAt).getTime();
    const clampedStart = new Date(Math.max(startMs, wsMonth));
    const clampedEnd = new Date(Math.min(endMs, weMonth));

    const startCol = clampedStart.getDay();
    const endCol = clampedEnd.getDay();

    let lane = -1;
    for (let i = 0; i < laneEndCols.length; i++) {
      if (laneEndCols[i] < startCol) {
        lane = i;
        laneEndCols[i] = endCol;
        break;
      }
    }
    if (lane === -1) {
      lane = laneEndCols.length;
      laneEndCols.push(endCol);
    }

    bars.push({ schedule, startCol, endCol, lane });
  }

  return bars;
}

type CalendarWeekRowProps = {
  dates: Date[];
  schedules: Schedule[];
  isCurrentMonth: (date: Date) => boolean;
  isSelectedDay: (date: Date) => boolean;
  isSunday: (date: Date) => boolean;
  onDateClick: (date: Date) => void;
};

function CalendarWeekRow({
  dates,
  schedules,
  isCurrentMonth,
  isSelectedDay,
  isSunday,
  onDateClick,
}: CalendarWeekRowProps) {
  const bars = layoutBars(dates, schedules, isCurrentMonth);
  const visibleBars = bars.filter((b) => b.lane < MAX_VISIBLE_LANES);
  const overflowMap = new Map<number, number>();
  for (const bar of bars) {
    if (bar.lane >= MAX_VISIBLE_LANES) {
      overflowMap.set(bar.startCol, (overflowMap.get(bar.startCol) ?? 0) + 1);
    }
  }

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-7">
        {dates.map((date) => (
          <DateBox
            key={date.toISOString()}
            date={date}
            isCurrentMonth={isCurrentMonth(date)}
            isSelected={isSelectedDay(date)}
            isSunday={isSunday(date)}
            onClick={onDateClick}
          />
        ))}
      </div>

      <div
        className="mt-0.5 mb-2.5"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gridTemplateRows: `${BAR_HEIGHT}px ${BAR_HEIGHT}px 8px`,
          rowGap: `${BAR_ROW_GAP}px`,
        }}
      >
        {visibleBars.map((bar) => (
          <div
            key={`${bar.schedule.title}-${bar.schedule.startedAt}-${bar.lane}`}
            style={{
              gridColumn: `${bar.startCol + 1} / ${bar.endCol + 2}`,
              gridRow: bar.lane + 1,
              backgroundColor: SCHEDULE_COLOR[bar.schedule.scheduleCategory],
            }}
            className="h-[13px] truncate rounded-full px-1 text-center text-[10px] leading-[13px] font-medium text-[#25374C]"
          >
            {bar.schedule.title}
          </div>
        ))}

        {[...overflowMap.entries()].map(([col, count]) => (
          <div
            key={`ov-${col}`}
            style={{ gridColumn: col + 1, gridRow: MAX_VISIBLE_LANES + 1 }}
            className="pl-1 text-[8px] leading-2 font-semibold text-indigo-500"
          >
            +{count}개
          </div>
        ))}
      </div>
    </div>
  );
}

export default CalendarWeekRow;
