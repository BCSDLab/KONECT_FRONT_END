import { useLayoutEffect } from 'react';

function useViewportHeightLock() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyHeight = body.style.height;
    const prevRootOverflow = root.style.overflow;
    const prevRootHeight = root.style.height;

    root.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    body.style.height = 'var(--viewport-height)';
    root.style.height = 'var(--viewport-height)';

    return () => {
      root.style.overflow = prevRootOverflow;
      body.style.overflow = prevBodyOverflow;
      body.style.height = prevBodyHeight;
      root.style.height = prevRootHeight;
    };
  }, []);
}

export default useViewportHeightLock;
