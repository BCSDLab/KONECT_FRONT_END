export const DEFAULT_BOTTOM_OVERLAY_INSET = 'var(--sab)';
export const DEFAULT_BOTTOM_NAV_OVERLAY_INSET = 'calc(80px + var(--sab))';
export const NOTIFICATION_LIST_BOTTOM_GAP = 24;
export const NOTIFICATION_TOAST_BOTTOM_GAP = 16;

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

export function getBottomOverlayOffset(bottomOverlayInset: string, gap: number) {
  return `calc(${bottomOverlayInset} + ${gap}px)`;
}
