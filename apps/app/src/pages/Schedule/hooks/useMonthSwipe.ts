import { useRef } from 'react';

type Params = {
  year: number;
  month: number;
  onChange: (year: number, month: number) => void;
};

export function useMonthSwipe({ year, month, onChange }: Params) {
  const startX = useRef(0);
  const startY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;

    const diffX = endX - startX.current;
    const diffY = endY - startY.current;

    startX.current = 0;
    startY.current = 0;

    if (Math.abs(diffY) > Math.abs(diffX)) return;
    if (Math.abs(diffX) < 60) return;

    if (diffX < 0) {
      if (month === 12) onChange(year + 1, 1);
      else onChange(year, month + 1);
    } else {
      if (month === 1) onChange(year - 1, 12);
      else onChange(year, month - 1);
    }
  };

  return { handleTouchStart, handleTouchEnd };
}
