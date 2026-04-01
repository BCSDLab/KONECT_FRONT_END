import { useLayoutElementsContext } from '@/contexts/useLayoutElementsContext';

export const DEFAULT_BOTTOM_OVERLAY_INSET = 'var(--sab)';
export const DEFAULT_BOTTOM_NAV_OVERLAY_INSET = 'calc(80px + var(--sab))';
export type BottomOverlayGap = 16 | 24;
export const DEFAULT_BOTTOM_OVERLAY_GAP: BottomOverlayGap = 16;

function getViewportHeight() {
  return window.visualViewport?.height ?? window.innerHeight;
}

export function getLayoutBottomOverlayInset(showBottomNav: boolean, bottomNav: HTMLElement | null) {
  if (!showBottomNav) {
    return DEFAULT_BOTTOM_OVERLAY_INSET;
  }

  if (!bottomNav) {
    return DEFAULT_BOTTOM_NAV_OVERLAY_INSET;
  }

  const visibleBottomInset = Math.max(0, getViewportHeight() - bottomNav.getBoundingClientRect().top);

  return `${Math.ceil(visibleBottomInset)}px`;
}

export function getBottomOverlayOffset(bottomOverlayInset: string, gap: BottomOverlayGap) {
  return `calc(${bottomOverlayInset} + ${gap}px)`;
}

export function useBottomOverlayOffset(gap: BottomOverlayGap = DEFAULT_BOTTOM_OVERLAY_GAP) {
  const { bottomOverlayInset } = useLayoutElementsContext();

  return getBottomOverlayOffset(bottomOverlayInset, gap);
}
