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
      className="flex h-9 w-full items-center justify-center"
    >
      <span
        className={[
          'flex h-7 w-7 items-center justify-center text-[13px] font-semibold',
          !isCurrentMonth
            ? 'text-transparent'
            : isSelected
              ? 'rounded-full bg-[#1B2B4B] text-white'
              : isSunday
                ? 'text-red-500'
                : 'text-black',
        ].join(' ')}
      >
        {isCurrentMonth ? date.getDate() : ''}
      </span>
    </button>
  );
}

export default DateBox;
