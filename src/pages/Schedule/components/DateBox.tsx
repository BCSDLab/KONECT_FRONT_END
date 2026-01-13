type Schedule = {
  title: string;
  startedAt: string;
  endedAt: string;
  scheduleCategory: 'UNIVERSITY' | 'CLUB' | 'COUNCIL';
};

type DateBoxProps = {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSunday: boolean;
  onClick: (date: Date) => void;
  schedules?: Schedule[];
};

type ScheduleCategory = Schedule['scheduleCategory'];

const SCHEDULE_COLOR: Record<ScheduleCategory, string> = {
  UNIVERSITY: '#AEDCBA',
  CLUB: '#FDE49B',
  COUNCIL: '#E9F2FA',
};

function DateBox({ date, isCurrentMonth, isToday, isSunday, onClick, schedules = [] }: DateBoxProps) {
  const visibleSchedules = schedules.slice(0, 2);
  const extraCount = schedules.length > 2 ? schedules.length - 2 : 0;

  return (
    <div className="flex flex-col items-center">
      <button
        type="button"
        disabled={!isCurrentMonth}
        onClick={() => isCurrentMonth && onClick(date)}
        className="relative h-10 w-full overflow-hidden"
      >
        {isCurrentMonth && <div className="absolute inset-0 mx-auto my-auto h-8 w-8 rounded-[3px] bg-[#F4F6F9]" />}

        {isCurrentMonth && schedules.length > 0 && (
          <div className="absolute inset-0 mx-auto my-auto flex h-8 w-8 flex-col gap-[1px] overflow-hidden rounded-[3px]">
            {schedules.length === 1 && (
              <div
                className="flex-1"
                style={{
                  backgroundColor: SCHEDULE_COLOR[schedules[0].scheduleCategory],
                }}
              />
            )}

            {schedules.length === 2 &&
              visibleSchedules.map((s) => (
                <div
                  key={s.title}
                  className="flex-1"
                  style={{
                    backgroundColor: SCHEDULE_COLOR[s.scheduleCategory],
                  }}
                />
              ))}

            {schedules.length >= 3 && (
              <>
                {visibleSchedules.map((s) => (
                  <div
                    key={s.title}
                    className="flex-1"
                    style={{
                      backgroundColor: SCHEDULE_COLOR[s.scheduleCategory],
                    }}
                  />
                ))}

                <div className="flex flex-1 items-center justify-center bg-white text-[9px] font-semibold text-indigo-500">
                  +{extraCount}
                </div>
              </>
            )}
          </div>
        )}
      </button>

      <span
        className={`mt-1 flex h-5 w-8 items-center justify-center text-[13px] font-semibold ${isSunday ? 'text-red-500' : 'text-black'} ${!isCurrentMonth ? 'text-transparent' : ''} ${isToday && isCurrentMonth ? 'rounded-[3px] bg-[#DAECFF]' : ''} `}
      >
        {isCurrentMonth ? date.getDate() : ''}
      </span>
    </div>
  );
}

export default DateBox;
