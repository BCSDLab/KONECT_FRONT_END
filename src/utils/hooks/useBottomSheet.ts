import { useRef, useState } from 'react';

export type SheetPosition = 'half' | 'full';

interface UseBottomSheetOptions {
  threshold?: number;
  defaultPosition?: SheetPosition;
  onPositionChange?: (position: SheetPosition) => void;
}

export const useBottomSheet = (options: UseBottomSheetOptions = {}) => {
  const { threshold = 30, defaultPosition = 'half', onPositionChange } = options;
  const [position, setPosition] = useState<SheetPosition>(defaultPosition);
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

    let newPosition = position;
    if (position === 'half' && currentTranslate < -threshold) {
      newPosition = 'full';
    } else if (position === 'full' && currentTranslate > threshold) {
      newPosition = 'half';
    }

    if (newPosition !== position) {
      setPosition(newPosition);
      onPositionChange?.(newPosition);
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
