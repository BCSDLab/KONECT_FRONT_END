import { useLayoutEffect, useState, type RefObject } from 'react';

const COMPACT_VIEWPORT_HEIGHT = 780;
const EXTRA_COMPACT_VIEWPORT_HEIGHT = 700;
const DEFAULT_BOTTOM_INSET_PX = 80;
const FULL_SHEET_TOP_OFFSET = 80;
const HALF_SHEET_BASE_OFFSET = 105;
const MAX_TIMER_SIZE = 312;
const TIMER_HORIZONTAL_PADDING = 48;

function resolveBottomInsetPx(bottomOverlayInset: string) {
  const probe = document.createElement('div');
  probe.style.position = 'fixed';
  probe.style.pointerEvents = 'none';
  probe.style.visibility = 'hidden';
  probe.style.paddingBottom = bottomOverlayInset;
  document.body.appendChild(probe);

  const resolvedInset = window.getComputedStyle(probe).paddingBottom;
  document.body.removeChild(probe);

  const parsedInset = Number.parseFloat(resolvedInset);

  return Number.isFinite(parsedInset) ? parsedInset : DEFAULT_BOTTOM_INSET_PX;
}

function getViewportHeight() {
  return window.visualViewport?.height ?? window.innerHeight;
}

function getViewportWidth() {
  return window.visualViewport?.width ?? window.innerWidth;
}

function createTimerLayout(bottomOverlayInset: string, timerSectionTop: number) {
  const viewportHeight = getViewportHeight();
  const viewportWidth = getViewportWidth();
  const bottomInsetPx = resolveBottomInsetPx(bottomOverlayInset);
  const isCompactViewport = viewportHeight <= COMPACT_VIEWPORT_HEIGHT;
  const isExtraCompactViewport = viewportHeight <= EXTRA_COMPACT_VIEWPORT_HEIGHT;
  const halfSheetHeightRatio = isExtraCompactViewport ? 0.43 : isCompactViewport ? 0.44 : 0.45;
  const halfSheetMinHeight = isExtraCompactViewport ? 204 : isCompactViewport ? 212 : 220;
  const timerSectionPaddingTopClassName = isCompactViewport ? 'pt-4' : 'pt-5';
  const halfSheetHeight = Math.max(
    halfSheetMinHeight,
    Math.round((viewportHeight - HALF_SHEET_BASE_OFFSET - bottomInsetPx) * halfSheetHeightRatio)
  );
  const halfSheetTopOffset = Math.max(FULL_SHEET_TOP_OFFSET, viewportHeight - bottomInsetPx - halfSheetHeight);
  const preferredTimerSize = Math.min(MAX_TIMER_SIZE, viewportWidth - TIMER_HORIZONTAL_PADDING);
  const timerToSheetGap = isExtraCompactViewport ? 20 : isCompactViewport ? 24 : 16;
  const availableTimerHeight = halfSheetTopOffset - timerSectionTop - timerToSheetGap;
  const timerSize = Math.max(0, Math.min(preferredTimerSize, availableTimerHeight));

  return {
    bottomInsetPx,
    fullSheetTopOffset: FULL_SHEET_TOP_OFFSET,
    halfSheetTopOffset,
    timerSectionPaddingTopClassName,
    timerSize,
  };
}

interface UseTimerLayoutParams {
  bottomOverlayInset: string;
  timerSectionRef: RefObject<HTMLDivElement | null>;
}

export function useTimerLayout({ bottomOverlayInset, timerSectionRef }: UseTimerLayoutParams) {
  const [layout, setLayout] = useState(() => createTimerLayout(bottomOverlayInset, 0));

  useLayoutEffect(() => {
    const updateLayout = () => {
      setLayout(createTimerLayout(bottomOverlayInset, timerSectionRef.current?.getBoundingClientRect().top ?? 0));
    };

    updateLayout();

    window.addEventListener('resize', updateLayout);
    window.visualViewport?.addEventListener('resize', updateLayout);

    return () => {
      window.removeEventListener('resize', updateLayout);
      window.visualViewport?.removeEventListener('resize', updateLayout);
    };
  }, [bottomOverlayInset, timerSectionRef]);

  return layout;
}
