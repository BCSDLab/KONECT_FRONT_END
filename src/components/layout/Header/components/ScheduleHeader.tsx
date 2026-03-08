import { useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ChevronDownIcon from '@/assets/svg/chevron-down.svg';
import ChevronLeftIcon from '@/assets/svg/chevron-left.svg';

function ScheduleHeader() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  const year = Number(searchParams.get('year') || new Date().getFullYear());
  const month = Number(searchParams.get('month') || new Date().getMonth() + 1);

  const handleBack = () => {
    navigate('/home', { replace: true });
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [selectedYear, selectedMonth] = e.target.value.split('-').map(Number);
    setSearchParams({ year: String(selectedYear), month: String(selectedMonth), day: '1' }, { replace: true });
  };

  const openMonthPicker = () => {
    const input = inputRef.current;
    if (!input) return;
    input.focus();
    if (typeof input.showPicker === 'function') input.showPicker();
  };

  return (
    <header className="fixed z-30 flex h-11 w-full items-center bg-white px-4 py-2">
      <button type="button" aria-label="뒤로가기" onClick={handleBack}>
        <ChevronLeftIcon />
      </button>

      <div className="relative flex flex-1 items-center justify-center">
        <input
          ref={inputRef}
          type="month"
          value={`${year}-${String(month).padStart(2, '0')}`}
          onChange={handleMonthChange}
          className="pointer-events-none absolute inset-0 opacity-0"
        />
        <button type="button" onClick={openMonthPicker} className="flex items-center gap-1 font-bold">
          {year}년 {String(month).padStart(2, '0')}월
          <ChevronDownIcon />
        </button>
      </div>

      {/* 오른쪽 균형용 빈 공간 (뒤로가기 버튼 너비만큼) */}
      <div className="w-6" />
    </header>
  );
}

export default ScheduleHeader;
