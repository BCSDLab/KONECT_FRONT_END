import { cn } from '@/utils/ts/cn';

type DateBoxProps = {
  date: Date;
  isCurrentMonth: boolean;
  isSelected: boolean;
  isSunday: boolean;
  onClick: (date: Date) => void;
};

function DateBox({ date, isCurrentMonth, isSelected, isSunday, onClick }: DateBoxProps) {
  return (
    <button
      type="button"
      disabled={!isCurrentMonth}
      onClick={() => onClick(date)}
      className="flex h-8.75 w-full items-center justify-center"
    >
      <span
        className={cn(
          'flex items-center justify-center text-[12px] leading-[1.6] font-semibold',
          !isCurrentMonth && 'text-transparent',
          isCurrentMonth && !isSelected && 'h-4 min-w-4 px-1',
          isCurrentMonth && isSelected && 'size-5 rounded-full bg-[#1B2B4B] text-white',
          isCurrentMonth && !isSelected && (isSunday ? 'text-red-500' : 'text-black')
        )}
      >
        {isCurrentMonth ? date.getDate() : ''}
      </span>
    </button>
  );
}

export default DateBox;
