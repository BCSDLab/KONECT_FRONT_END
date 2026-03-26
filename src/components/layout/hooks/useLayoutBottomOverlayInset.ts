import { useLayoutEffect, useState, type RefObject } from 'react';
import {
  DEFAULT_BOTTOM_NAV_OVERLAY_INSET,
  DEFAULT_BOTTOM_OVERLAY_INSET,
  getLayoutBottomOverlayInset,
} from '@/components/layout/layoutMetrics';

export function useLayoutBottomOverlayInset(showBottomNav: boolean, bottomNavRef: RefObject<HTMLElement | null>) {
  const [bottomOverlayInset, setBottomOverlayInset] = useState(
    showBottomNav ? DEFAULT_BOTTOM_NAV_OVERLAY_INSET : DEFAULT_BOTTOM_OVERLAY_INSET
  );

  useLayoutEffect(() => {
    const measureInset = () => {
      setBottomOverlayInset(getLayoutBottomOverlayInset(showBottomNav, bottomNavRef.current));
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
