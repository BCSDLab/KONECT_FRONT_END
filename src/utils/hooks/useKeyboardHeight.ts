import { useEffect } from 'react';

function useKeyboardHeight() {
  useEffect(() => {
    const visualViewport = window.visualViewport;

    const setViewportHeight = () => {
      const height = visualViewport?.height ?? window.innerHeight;
      document.documentElement.style.setProperty('--viewport-height', `${height}px`);
    };

    setViewportHeight();

    visualViewport?.addEventListener('resize', setViewportHeight);
    visualViewport?.addEventListener('scroll', setViewportHeight);
    window.addEventListener('resize', setViewportHeight);

    return () => {
      visualViewport?.removeEventListener('resize', setViewportHeight);
      visualViewport?.removeEventListener('scroll', setViewportHeight);
      window.removeEventListener('resize', setViewportHeight);
    };
  }, []);
}

export default useKeyboardHeight;
