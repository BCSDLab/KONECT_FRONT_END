import { useLayoutElementsContext } from '@/contexts/useLayoutElementsContext';

export const DEFAULT_BOTTOM_OVERLAY_INSET = 'var(--sab)';
export const DEFAULT_BOTTOM_NAV_OVERLAY_INSET = 'calc(80px + var(--sab))';
export type BottomOverlayGap = 16 | 24;
export const DEFAULT_BOTTOM_OVERLAY_GAP: BottomOverlayGap = 16;
const DEFAULT_BOTTOM_OVERLAY_INSET_PX = 0;
const DEFAULT_BOTTOM_NAV_OVERLAY_INSET_PX = 80;

export interface LayoutBottomOverlayInset {
  bottomOverlayInset: string;
  bottomOverlayInsetPx: number;
}

function getViewportHeight() {
  return window.visualViewport?.height ?? window.innerHeight;
}

function resolveBottomOverlayInsetPx(bottomOverlayInset: string, fallback: number) {
  if (typeof document === 'undefined') {
    return fallback;
  }

  const probe = document.createElement('div');
  probe.style.position = 'fixed';
  probe.style.pointerEvents = 'none';
  probe.style.visibility = 'hidden';
  probe.style.paddingBottom = bottomOverlayInset;
  document.body.appendChild(probe);

  const resolvedInset = window.getComputedStyle(probe).paddingBottom;
  document.body.removeChild(probe);

  const parsedInset = Number.parseFloat(resolvedInset);

  return Number.isFinite(parsedInset) ? parsedInset : fallback;
}

export function getDefaultLayoutBottomOverlayInset(showBottomNav: boolean): LayoutBottomOverlayInset {
  if (!showBottomNav) {
    return {
      bottomOverlayInset: DEFAULT_BOTTOM_OVERLAY_INSET,
      bottomOverlayInsetPx: resolveBottomOverlayInsetPx(DEFAULT_BOTTOM_OVERLAY_INSET, DEFAULT_BOTTOM_OVERLAY_INSET_PX),
    };
  }

  return {
    bottomOverlayInset: DEFAULT_BOTTOM_NAV_OVERLAY_INSET,
    bottomOverlayInsetPx: resolveBottomOverlayInsetPx(
      DEFAULT_BOTTOM_NAV_OVERLAY_INSET,
      DEFAULT_BOTTOM_NAV_OVERLAY_INSET_PX
    ),
  };
}

export function getLayoutBottomOverlayInset(
  showBottomNav: boolean,
  bottomNav: HTMLElement | null
): LayoutBottomOverlayInset {
  if (!showBottomNav) {
    return getDefaultLayoutBottomOverlayInset(showBottomNav);
  }

  if (!bottomNav) {
    return getDefaultLayoutBottomOverlayInset(showBottomNav);
  }

  const visibleBottomInset = Math.ceil(Math.max(0, getViewportHeight() - bottomNav.getBoundingClientRect().top));

  return {
    bottomOverlayInset: `${visibleBottomInset}px`,
    bottomOverlayInsetPx: visibleBottomInset,
  };
}

export function getBottomOverlayOffset(bottomOverlayInset: string, gap: BottomOverlayGap) {
  return `calc(${bottomOverlayInset} + ${gap}px)`;
}

export function useBottomOverlayOffset(gap: BottomOverlayGap = DEFAULT_BOTTOM_OVERLAY_GAP) {
  const { bottomOverlayInset } = useLayoutElementsContext();

  return getBottomOverlayOffset(bottomOverlayInset, gap);
}
