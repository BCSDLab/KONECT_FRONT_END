import { useLayoutEffect, useState, type RefObject } from 'react';

const COMPACT_VIEWPORT_HEIGHT = 780;
const EXTRA_COMPACT_VIEWPORT_HEIGHT = 700;
const FULL_SHEET_TOP_OFFSET = 80;
const HALF_SHEET_BASE_OFFSET = 105;
const MAX_TIMER_SIZE = 312;
const MIN_TIMER_SIZE = 192;
const TIMER_HORIZONTAL_PADDING = 48;

function getViewportHeight() {
  return window.visualViewport?.height ?? window.innerHeight;
}

function getViewportWidth() {
  return window.visualViewport?.width ?? window.innerWidth;
}

function createTimerLayout(bottomInsetPx: number, timerSectionTop: number) {
  const viewportHeight = getViewportHeight();
  const viewportWidth = getViewportWidth();
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
  const minimumTimerSize = Math.min(MIN_TIMER_SIZE, preferredTimerSize);
  const timerToSheetGap = isExtraCompactViewport ? 20 : isCompactViewport ? 24 : 16;
  const availableTimerHeight = halfSheetTopOffset - timerSectionTop - timerToSheetGap;
  const timerSize = Math.max(minimumTimerSize, Math.min(preferredTimerSize, availableTimerHeight));

  return {
    bottomInsetPx,
    fullSheetTopOffset: FULL_SHEET_TOP_OFFSET,
    halfSheetTopOffset,
    timerSectionPaddingTopClassName,
    timerSize,
  };
}

interface UseTimerLayoutParams {
  bottomOverlayInsetPx: number;
  timerSectionRef: RefObject<HTMLDivElement | null>;
}

export function useTimerLayout({ bottomOverlayInsetPx, timerSectionRef }: UseTimerLayoutParams) {
  const [layout, setLayout] = useState(() => createTimerLayout(bottomOverlayInsetPx, 0));

  useLayoutEffect(() => {
    const updateLayout = () => {
      setLayout(createTimerLayout(bottomOverlayInsetPx, timerSectionRef.current?.getBoundingClientRect().top ?? 0));
    };

    updateLayout();

    window.addEventListener('resize', updateLayout);
    window.visualViewport?.addEventListener('resize', updateLayout);

    return () => {
      window.removeEventListener('resize', updateLayout);
      window.visualViewport?.removeEventListener('resize', updateLayout);
    };
  }, [bottomOverlayInsetPx, timerSectionRef]);

  return layout;
}
