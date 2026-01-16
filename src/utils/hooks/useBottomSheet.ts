import { useRef, useState } from 'react';

type SheetPosition = 'half' | 'full';

export const useBottomSheet = (threshold = 30) => {
  const [position, setPosition] = useState<SheetPosition>('half');
  const [isDragging, setIsDragging] = useState(false);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const startY = useRef(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const deltaY = e.touches[0].clientY - startY.current;
    setCurrentTranslate(deltaY);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);

    if (position === 'half' && currentTranslate < -threshold) {
      setPosition('full');
    } else if (position === 'full' && currentTranslate > threshold) {
      setPosition('half');
    }

    setCurrentTranslate(0);
  };

  return {
    position,
    isDragging,
    currentTranslate,
    sheetRef,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
};
