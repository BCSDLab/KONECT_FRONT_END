import { useEffect } from 'react';

function useKeyboardHeight() {
  useEffect(() => {
    const visualViewport = window.visualViewport;
    if (!visualViewport) return;

    const setViewportHeight = () => {
      document.documentElement.style.setProperty('--viewport-height', `${visualViewport.height}px`);
    };

    setViewportHeight();

    visualViewport.addEventListener('resize', setViewportHeight);
    visualViewport.addEventListener('scroll', setViewportHeight);

    return () => {
      visualViewport.removeEventListener('resize', setViewportHeight);
      visualViewport.removeEventListener('scroll', setViewportHeight);
    };
  }, []);
}

export default useKeyboardHeight;
