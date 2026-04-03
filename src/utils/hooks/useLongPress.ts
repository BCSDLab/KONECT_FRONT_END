import { useCallback, useRef } from 'react';

interface LongPressOptions {
  delay?: number;
  onLongPress: (x: number, y: number) => void;
}

export function useLongPress({ delay = 500, onLongPress }: LongPressOptions) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const start = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      timerRef.current = setTimeout(() => {
        onLongPress(touch.clientX, touch.clientY);
      }, delay);
    },
    [delay, onLongPress]
  );

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  return {
    onTouchStart: start,
    onTouchEnd: cancel,
    onTouchMove: cancel,
  };
}
