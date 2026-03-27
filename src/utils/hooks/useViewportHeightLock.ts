import { useLayoutEffect } from 'react';

function useViewportHeightLock() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const prevBodyHeight = body.style.height;
    const prevRootHeight = root.style.height;

    body.style.height = 'var(--viewport-height)';
    root.style.height = 'var(--viewport-height)';

    return () => {
      body.style.height = prevBodyHeight;
      root.style.height = prevRootHeight;
    };
  }, []);
}

export default useViewportHeightLock;
