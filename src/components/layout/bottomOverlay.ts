import { useLayoutElementsContext } from '@/contexts/useLayoutElementsContext';

export const DEFAULT_BOTTOM_OVERLAY_INSET = 'var(--sab)';
export const DEFAULT_BOTTOM_NAV_OVERLAY_INSET = 'calc(80px + var(--sab))';
export type BottomOverlayGap = 16 | 24;
export const DEFAULT_BOTTOM_OVERLAY_GAP: BottomOverlayGap = 16;
const DEFAULT_BOTTOM_OVERLAY_INSET_PX = 0;
const DEFAULT_BOTTOM_NAV_OVERLAY_INSET_PX = 80;
let cachedProbe: HTMLDivElement | null = null;

export interface LayoutBottomOverlayInset {
  bottomOverlayInset: string;
  bottomOverlayInsetPx: number;
}

function getViewportHeight() {
  return window.visualViewport?.height ?? window.innerHeight;
}

function getOrCreateProbe() {
  if (typeof document === 'undefined' || !document.body) {
    return null;
  }

  if (cachedProbe?.isConnected) {
    return cachedProbe;
  }

  cachedProbe = document.createElement('div');
  cachedProbe.style.position = 'fixed';
  cachedProbe.style.pointerEvents = 'none';
  cachedProbe.style.visibility = 'hidden';
  document.body.appendChild(cachedProbe);

  return cachedProbe;
}

function resolveBottomOverlayInsetPx(bottomOverlayInset: string, fallback: number) {
  const probe = getOrCreateProbe();

  if (!probe) {
    return fallback;
  }

  probe.style.paddingBottom = bottomOverlayInset;

  const resolvedInset = window.getComputedStyle(probe).paddingBottom;
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
