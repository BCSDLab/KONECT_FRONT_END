import { useEffect } from 'react';

export default function useClickTouchOutside<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  handler: (event: Event | MouseEvent | TouchEvent) => void
) {
  useEffect(() => {
    function onClickHandler(event: Event | MouseEvent) {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    }

    function onTouchHandler(event: TouchEvent) {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    }

    window.addEventListener('mousedown', onClickHandler);
    window.addEventListener('touchstart', onTouchHandler);

    return () => {
      window.removeEventListener('mousedown', onClickHandler);
      window.removeEventListener('touchstart', onTouchHandler);
    };
  }, [ref, handler]);
}
