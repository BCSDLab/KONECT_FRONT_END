import { useRef } from 'react';

interface LongPressOptions {
  delay?: number;
  onLongPress: (x: number, y: number) => void;
}

const LONG_PRESS_TIME = 500;
export function useLongPress({ delay = LONG_PRESS_TIME, onLongPress }: LongPressOptions) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerIdRef = useRef<number | null>(null);
  const startPointRef = useRef<{ x: number; y: number } | null>(null);
  const didLongPressRef = useRef(false);

  const clearTimer = () => {
    if (!timerRef.current) return;

    clearTimeout(timerRef.current);
    timerRef.current = null;
  };

  const cancel = () => {
    clearTimer();
    pointerIdRef.current = null;
    startPointRef.current = null;
  };

  const start = (e: React.PointerEvent) => {
    if (e.pointerType !== 'touch') return;

    cancel();
    didLongPressRef.current = false;
    pointerIdRef.current = e.pointerId;
    startPointRef.current = { x: e.clientX, y: e.clientY };

    timerRef.current = setTimeout(() => {
      didLongPressRef.current = true;
      onLongPress(e.clientX, e.clientY);
      clearTimer();
    }, delay);
  };

  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== 'touch') return;
    if (pointerIdRef.current !== e.pointerId) return;
    if (!startPointRef.current) return;

    const deltaX = Math.abs(e.clientX - startPointRef.current.x);
    const deltaY = Math.abs(e.clientY - startPointRef.current.y);

    if (deltaX > 8 || deltaY > 8) {
      cancel();
    }
  };

  const end = (e: React.PointerEvent) => {
    if (e.pointerType !== 'touch') return;
    if (pointerIdRef.current !== e.pointerId) return;

    if (didLongPressRef.current) {
      e.preventDefault();
    }

    cancel();
  };

  const handleClickCapture = (e: React.MouseEvent) => {
    if (!didLongPressRef.current) return;

    e.preventDefault();
    e.stopPropagation();
    didLongPressRef.current = false;
  };

  const preventNativeContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return {
    onPointerDown: start,
    onPointerMove: move,
    onPointerUp: end,
    onPointerCancel: cancel,
    onPointerLeave: cancel,
    onClickCapture: handleClickCapture,
    onContextMenu: preventNativeContextMenu,
  };
}
