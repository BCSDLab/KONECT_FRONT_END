interface DateBoxProps {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSunday: boolean;
  onClick: (date: Date) => void;
}

function DateBox({ date, isCurrentMonth, isToday, isSunday, onClick }: DateBoxProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <button
        type="button"
        onClick={() => onClick(date)}
        className={`flex h-8 w-8 items-center justify-center rounded-[3px] transition-all active:scale-[0.85] ${isCurrentMonth ? 'bg-indigo-25' : 'bg-transparent'} ${isSunday ? 'text-red-500' : 'text-black'}`}
      />
      <div>
        <span
          className={`text-caption-1-sb flex w-8 items-center justify-center rounded-[3px] ${isSunday ? 'text-red-500' : 'text-black'} ${!isCurrentMonth ? 'text-transparent' : ''} ${isToday ? 'bg-[#DAECFF]' : 'bg-transparent'} `}
        >
          {date.getDate()}
        </span>
      </div>
    </div>
  );
}

export default DateBox;
