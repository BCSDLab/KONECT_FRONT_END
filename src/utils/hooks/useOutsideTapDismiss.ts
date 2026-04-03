import { useEffect, useRef, type RefObject } from 'react';

const TAP_MOVE_THRESHOLD_PX = 8;
const SUPPRESS_CLICK_TIMEOUT_MS = 400;

export default function useOutsideTapDismiss<T extends HTMLElement>(ref: RefObject<T | null>, onDismiss: () => void) {
  const onDismissRef = useRef(onDismiss);

  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  useEffect(() => {
    let activePointerId: number | null = null;
    let startX = 0;
    let startY = 0;

    const resetGesture = () => {
      activePointerId = null;
      startX = 0;
      startY = 0;
    };

    const suppressNextClick = () => {
      let timeoutId = 0;

      const handleClick = (event: MouseEvent) => {
        window.clearTimeout(timeoutId);
        window.removeEventListener('click', handleClick, true);
        event.preventDefault();
        event.stopPropagation();
      };

      timeoutId = window.setTimeout(() => {
        window.removeEventListener('click', handleClick, true);
      }, SUPPRESS_CLICK_TIMEOUT_MS);

      window.addEventListener('click', handleClick, true);
    };

    const handlePointerDown = (event: PointerEvent) => {
      const element = ref.current;

      if (!element) return;
      if (!event.isPrimary) return;
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      if (event.target instanceof Node && element.contains(event.target)) return;

      activePointerId = event.pointerId;
      startX = event.clientX;
      startY = event.clientY;

      event.stopPropagation();
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (activePointerId !== event.pointerId) return;

      const deltaX = Math.abs(event.clientX - startX);
      const deltaY = Math.abs(event.clientY - startY);

      if (deltaX <= TAP_MOVE_THRESHOLD_PX && deltaY <= TAP_MOVE_THRESHOLD_PX) return;

      resetGesture();
      onDismissRef.current();
    };

    const handlePointerUp = (event: PointerEvent) => {
      if (activePointerId !== event.pointerId) return;

      resetGesture();
      suppressNextClick();
      onDismissRef.current();
    };

    const handlePointerCancel = (event: PointerEvent) => {
      if (activePointerId !== event.pointerId) return;

      resetGesture();
    };

    window.addEventListener('pointerdown', handlePointerDown, true);
    window.addEventListener('pointermove', handlePointerMove, true);
    window.addEventListener('pointerup', handlePointerUp, true);
    window.addEventListener('pointercancel', handlePointerCancel, true);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown, true);
      window.removeEventListener('pointermove', handlePointerMove, true);
      window.removeEventListener('pointerup', handlePointerUp, true);
      window.removeEventListener('pointercancel', handlePointerCancel, true);
    };
  }, [ref]);
}
