import { useLayoutEffect, useState, type RefObject } from 'react';
import { getDefaultLayoutBottomOverlayInset, getLayoutBottomOverlayInset } from '@/components/layout/bottomOverlay';

export function useLayoutBottomOverlayInset(showBottomNav: boolean, bottomNavRef: RefObject<HTMLElement | null>) {
  const [bottomOverlayInset, setBottomOverlayInset] = useState(() => getDefaultLayoutBottomOverlayInset(showBottomNav));

  useLayoutEffect(() => {
    const measureInset = () => {
      const nextInset = getLayoutBottomOverlayInset(showBottomNav, bottomNavRef.current);

      setBottomOverlayInset((previousInset) =>
        previousInset.bottomOverlayInset === nextInset.bottomOverlayInset &&
        previousInset.bottomOverlayInsetPx === nextInset.bottomOverlayInsetPx
          ? previousInset
          : nextInset
      );
    };

    measureInset();

    if (!showBottomNav) {
      return;
    }

    const visualViewport = window.visualViewport;
    const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measureInset) : undefined;

    if (bottomNavRef.current) {
      resizeObserver?.observe(bottomNavRef.current);
    }

    window.addEventListener('resize', measureInset);
    window.addEventListener('orientationchange', measureInset);
    visualViewport?.addEventListener('resize', measureInset);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('resize', measureInset);
      window.removeEventListener('orientationchange', measureInset);
      visualViewport?.removeEventListener('resize', measureInset);
    };
  }, [bottomNavRef, showBottomNav]);

  return bottomOverlayInset;
}
