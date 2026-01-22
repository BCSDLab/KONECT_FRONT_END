import { useRef } from 'react';
import RightArrowIcon from '@/assets/svg/chevron-down.svg';

function MonthPicker({
  year,
  month,
  setDate,
}: {
  year: number;
  month: number;
  setDate: (year?: number, month?: number) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [selectedYear, selectedMonth] = e.target.value.split('-').map(Number);

    setDate(selectedYear, selectedMonth);
  };

  const openMonthPicker = () => {
    const input = inputRef.current;
    if (!input) return;

    input.focus();
    if (typeof input.showPicker === 'function') {
      input.showPicker();
    }
  };

  return (
    <div className="relative flex items-center">
      <input
        ref={inputRef}
        type="month"
        value={`${year}-${String(month).padStart(2, '0')}`}
        onChange={handleMonthChange}
        required
        className="pointer-events-none absolute inset-0 opacity-0 [&::-webkit-clear-button]:hidden [&::-webkit-inner-spin-button]:hidden"
      />

      <button
        type="button"
        onClick={openMonthPicker}
        className="text-subtitle-3-b relative z-2 flex w-full cursor-pointer items-center bg-transparent pr-7 text-left"
      >
        {year}년 {String(month).padStart(2, '0')}월
      </button>

      <RightArrowIcon className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 pl-1" />
    </div>
  );
}

export default MonthPicker;
