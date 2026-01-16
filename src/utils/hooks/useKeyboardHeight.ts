import { useState, useEffect } from 'react';

function useKeyboardHeight() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [viewportHeight, setViewportHeight] = useState<number | null>(null);

  useEffect(() => {
    const visualViewport = window.visualViewport;
    if (!visualViewport) return;

    const handleResize = () => {
      const currentKeyboardHeight = window.innerHeight - visualViewport.height;
      setKeyboardHeight(Math.max(0, currentKeyboardHeight));

      if (currentKeyboardHeight > 0) {
        setViewportHeight(visualViewport.height);
      } else {
        setViewportHeight(null);
      }
    };

    visualViewport.addEventListener('resize', handleResize);
    visualViewport.addEventListener('scroll', handleResize);

    return () => {
      visualViewport.removeEventListener('resize', handleResize);
      visualViewport.removeEventListener('scroll', handleResize);
    };
  }, []);

  return { keyboardHeight, viewportHeight };
}

export default useKeyboardHeight;
