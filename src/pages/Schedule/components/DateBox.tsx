type MockSchedule = {
  title: string;
  startedAt: string;
  endedAt: string;
  scheduleCategory: 'UNIVERSITY' | 'CLUB' | 'COUNCIL';
};

type SchedulePosition = 'single' | 'start' | 'middle' | 'end';

type ScheduleWithMeta = MockSchedule & {
  lane: number;
  position: SchedulePosition;
};

type DateBoxProps = {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSunday: boolean;
  onClick: (date: Date) => void;
  schedules?: ScheduleWithMeta[];
};

type ScheduleCategory = MockSchedule['scheduleCategory'];

const SCHEDULE_COLOR: Record<ScheduleCategory, string> = {
  UNIVERSITY: '#AEDCBA',
  CLUB: '#FDE49B',
  COUNCIL: '#E9F2FA',
};

const getRadiusClass = (position: SchedulePosition) => {
  switch (position) {
    case 'single':
      return 'rounded-[3px]';
    case 'start':
      return 'rounded-l-[3px]';
    case 'end':
      return 'rounded-r-[3px]';
    default:
      return 'rounded-none';
  }
};

const getBarPositionClass = (position: SchedulePosition) => {
  switch (position) {
    case 'start':
      return 'left-0 right-[-100%]';
    case 'middle':
      return 'left-[-100%] right-[-100%]';
    case 'end':
      return 'left-[-100%] right-0';
    case 'single':
    default:
      return 'left-0 right-0';
  }
};

function DateBox({ date, isCurrentMonth, isToday, isSunday, onClick, schedules = [] }: DateBoxProps) {
  const sortedByLane = schedules.slice().sort((a, b) => a.lane - b.lane);

  let visibleSchedules: ScheduleWithMeta[] = [];

  if (sortedByLane.length <= 2) {
    visibleSchedules = sortedByLane;
  } else {
    visibleSchedules = sortedByLane.filter((s) => s.lane === 0 || s.lane === 1);
  }

  const extraCount = schedules.length > visibleSchedules.length ? schedules.length - visibleSchedules.length : 0;

  const isSingleFull = visibleSchedules.length === 1 && visibleSchedules[0].position === 'single';

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        disabled={!isCurrentMonth}
        onClick={() => isCurrentMonth && onClick(date)}
        className="relative h-10 w-full overflow-hidden"
      >
        {isCurrentMonth && <div className="absolute inset-0 mx-auto my-auto h-8 w-8 rounded-[3px] bg-[#F4F6F9]" />}

        {isCurrentMonth &&
          visibleSchedules.map((schedule) => {
            if (isSingleFull) {
              return (
                <div
                  key={`${schedule.title}-${schedule.lane}`}
                  className="absolute top-1/2 left-1/2 h-7 w-8 -translate-x-1/2 -translate-y-1/2 rounded-[3px]"
                  style={{
                    backgroundColor: SCHEDULE_COLOR[schedule.scheduleCategory],
                  }}
                />
              );
            }

            const topClass = schedule.lane === 0 ? 'top-[4px]' : 'top-[17px]';

            return (
              <div
                key={`${schedule.title}-${schedule.lane}`}
                className={`absolute ${topClass} h-[12px] ${getBarPositionClass(schedule.position)} ${getRadiusClass(schedule.position)} `}
                style={{
                  backgroundColor: SCHEDULE_COLOR[schedule.scheduleCategory],
                }}
              />
            );
          })}

        {isCurrentMonth && extraCount > 0 && (
          <div className="absolute right-[2px] bottom-[2px] text-[10px] font-semibold text-indigo-400">
            +{extraCount}
          </div>
        )}
      </button>

      <span
        className={`mt-1 flex h-6 w-6 items-center justify-center text-[13px] font-semibold ${isSunday ? 'text-red-500' : 'text-black'} ${!isCurrentMonth ? 'text-transparent' : ''} ${isToday && isCurrentMonth ? 'rounded-[3px] bg-[#DAECFF]' : ''} `}
      >
        {isCurrentMonth ? date.getDate() : ''}
      </span>
    </div>
  );
}

// function DateBox({ date, isCurrentMonth, isToday, isSunday, onClick }: DateBoxProps) {
//   return (
//     <div className="flex flex-col items-center">
//       <button
//         type="button"
//         disabled={!isCurrentMonth}
//         onClick={() => isCurrentMonth && onClick(date)}
//         className="relative h-10 w-full"
//       >
//         {isCurrentMonth && (
//           <div className="absolute top-1/2 left-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-[3px] bg-[#F4F6F9]" />
//         )}
//       </button>

//       <span
//         className={`mt-1 flex h-6 w-6 items-center justify-center text-[13px] font-semibold ${
//           isSunday ? 'text-red-500' : 'text-black'
//         } ${isToday && isCurrentMonth ? 'rounded-[3px] bg-[#DAECFF]' : ''}`}
//       >
//         {isCurrentMonth ? date.getDate() : ''}
//       </span>
//     </div>
//   );
// }

export default DateBox;
