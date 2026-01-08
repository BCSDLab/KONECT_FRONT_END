import { useRef, useState } from 'react';
import RightArrowIcon from '@/assets/svg/chevron-right.svg'; // 아래 화살표로 바꿔야함

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
  const [tempYear, setTempYear] = useState(year);
  const [tempMonth, setTempMonth] = useState(month);

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [selectedYear, selectedMonth] = e.target.value.split('-').map(Number);
    setTempYear(selectedYear);
    setTempMonth(selectedMonth);
  };

  const handleBlur = () => {
    setDate(tempYear, tempMonth);
  };

  return (
    <div className="relative flex w-[140px] items-center">
      <input
        ref={inputRef}
        type="month"
        value={`${year}-${String(month).padStart(2, '0')}`}
        onChange={handleMonthChange}
        onBlur={handleBlur}
        className="text-subtitle-3-b w-full bg-transparent pr-7"
      />
      <RightArrowIcon className="absolute top-1/2 right-2 -translate-y-1/2" />
    </div>
  );
}

export default MonthPicker;
