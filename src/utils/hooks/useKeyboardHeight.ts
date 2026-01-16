import { useEffect } from 'react';

function useKeyboardHeight() {
  useEffect(() => {
    const visualViewport = window.visualViewport;
    const root = document.documentElement;
    const body = document.body;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyHeight = body.style.height;
    const prevRootHeight = root.style.height;

    const setViewportHeight = () => {
      const height = visualViewport?.height ?? window.innerHeight;
      document.documentElement.style.setProperty('--viewport-height', `${height}px`);
    };

    setViewportHeight();

    body.style.overflow = 'hidden';
    body.style.height = 'var(--viewport-height)';
    root.style.height = 'var(--viewport-height)';

    visualViewport?.addEventListener('resize', setViewportHeight);
    visualViewport?.addEventListener('scroll', setViewportHeight);
    window.addEventListener('resize', setViewportHeight);

    return () => {
      visualViewport?.removeEventListener('resize', setViewportHeight);
      visualViewport?.removeEventListener('scroll', setViewportHeight);
      window.removeEventListener('resize', setViewportHeight);
      body.style.overflow = prevBodyOverflow;
      body.style.height = prevBodyHeight;
      root.style.height = prevRootHeight;
    };
  }, []);
}

export default useKeyboardHeight;
