import { useEffect, useRef } from 'react';

export default function useClickTouchOutside<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  handler: (event: MouseEvent | TouchEvent) => void
) {
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const element = ref.current;
      if (!element) return;
      if (element.contains(event.target as Node)) return;

      event.preventDefault();
      event.stopPropagation();
      handlerRef.current(event);
    };

    window.addEventListener('mousedown', listener);
    window.addEventListener('touchstart', listener, { passive: false });

    return () => {
      window.removeEventListener('mousedown', listener);
      window.removeEventListener('touchstart', listener);
    };
  }, [ref]);
}
