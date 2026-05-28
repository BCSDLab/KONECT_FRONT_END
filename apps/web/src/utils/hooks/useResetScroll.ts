import { useLayoutEffect } from 'react';

export function useResetScroll(resetKey?: unknown) {
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [resetKey]);
}

export default useResetScroll;
