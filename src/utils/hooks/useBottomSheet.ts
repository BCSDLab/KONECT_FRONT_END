import { useEffect, useRef, useState } from 'react';

export type SheetPosition = 'half' | 'full';

interface UseBottomSheetOptions {
  threshold?: number;
  defaultPosition?: SheetPosition;
  position?: SheetPosition;
  onPositionChange?: (position: SheetPosition) => void;
}

export const useBottomSheet = (options: UseBottomSheetOptions = {}) => {
  const { threshold = 30, defaultPosition = 'half', position: controlledPosition, onPositionChange } = options;
  const [uncontrolledPosition, setUncontrolledPosition] = useState<SheetPosition>(defaultPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const isDraggingRef = useRef(false);
  const startY = useRef(0);
  const translateRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const settleFrameRef = useRef<number | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const position = controlledPosition ?? uncontrolledPosition;

  const flushTranslate = () => {
    animationFrameRef.current = null;
    setCurrentTranslate(translateRef.current);
  };

  const cancelTranslateFrame = () => {
    if (animationFrameRef.current === null) return;

    window.cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = null;
  };

  const cancelSettleFrame = () => {
    if (settleFrameRef.current === null) return;

    window.cancelAnimationFrame(settleFrameRef.current);
    settleFrameRef.current = null;
  };

  const scheduleTranslateUpdate = () => {
    if (animationFrameRef.current !== null) return;

    animationFrameRef.current = window.requestAnimationFrame(flushTranslate);
  };

  const resetDraggingState = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
    translateRef.current = 0;

    cancelTranslateFrame();
    setCurrentTranslate(0);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    cancelSettleFrame();
    isDraggingRef.current = true;
    setIsDragging(true);
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current) return;

    const deltaY = e.touches[0].clientY - startY.current;
    translateRef.current = deltaY;
    scheduleTranslateUpdate();
  };

  const handleTouchEnd = (e?: React.TouchEvent) => {
    if (!isDraggingRef.current) return;

    const finalTouchY = e?.changedTouches[0]?.clientY;
    const finalTranslate = finalTouchY != null ? finalTouchY - startY.current : translateRef.current;
    cancelTranslateFrame();
    translateRef.current = finalTranslate;
    setCurrentTranslate(finalTranslate);

    let newPosition = position;
    if (position === 'half' && finalTranslate < -threshold) {
      newPosition = 'full';
    } else if (position === 'full' && finalTranslate > threshold) {
      newPosition = 'half';
    }

    settleFrameRef.current = window.requestAnimationFrame(() => {
      settleFrameRef.current = null;

      if (newPosition !== position) {
        if (controlledPosition == null) {
          setUncontrolledPosition(newPosition);
        }
        onPositionChange?.(newPosition);
      }

      resetDraggingState();
    });
  };

  useEffect(() => {
    return () => {
      cancelTranslateFrame();
      cancelSettleFrame();
    };
  }, []);

  return {
    position,
    isDragging,
    currentTranslate,
    sheetRef,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onTouchCancel: handleTouchEnd,
    },
  };
};
