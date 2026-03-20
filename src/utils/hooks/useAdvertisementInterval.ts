import { startTransition, useEffectEvent, useLayoutEffect, useState, type RefObject } from 'react';
import { useLayoutElementsContext } from '@/contexts/useLayoutElementsContext';

const DEFAULT_ITEMS_PER_ADVERTISEMENT = 4;
const DEFAULT_ITEM_GAP = 8;

interface UseAdvertisementIntervalParams {
  firstItemRef: RefObject<HTMLElement | null>;
  secondItemRef: RefObject<HTMLElement | null>;
  itemCount: number;
  enabled: boolean;
}

const getViewportBottom = (bottomNav: HTMLElement | null) => {
  if (bottomNav) {
    return bottomNav.getBoundingClientRect().top;
  }

  return window.visualViewport?.height ?? window.innerHeight;
};

export const useAdvertisementInterval = ({
  firstItemRef,
  secondItemRef,
  itemCount,
  enabled,
}: UseAdvertisementIntervalParams) => {
  const { mainRef, bottomNavRef } = useLayoutElementsContext();
  const [itemsPerAdvertisement, setItemsPerAdvertisement] = useState<number>(DEFAULT_ITEMS_PER_ADVERTISEMENT);

  const measureAdvertisementInterval = useEffectEvent(() => {
    const scrollContainer = mainRef.current;
    const firstItem = firstItemRef.current;

    if (!scrollContainer || !firstItem) return;

    const secondItem = secondItemRef.current;
    const mainRect = scrollContainer.getBoundingClientRect();
    const firstItemRect = firstItem.getBoundingClientRect();
    const secondItemRect = secondItem?.getBoundingClientRect();
    const firstItemTopInContent = firstItemRect.top - mainRect.top + scrollContainer.scrollTop;
    const availableHeight = getViewportBottom(bottomNavRef.current) - (mainRect.top + firstItemTopInContent);
    const gap = secondItemRect
      ? Math.max(0, secondItemRect.top - firstItemRect.top - firstItemRect.height)
      : DEFAULT_ITEM_GAP;
    const slotHeight = firstItemRect.height + gap;

    if (availableHeight <= 0 || slotHeight <= 0) {
      startTransition(() => {
        setItemsPerAdvertisement((previous) =>
          previous === DEFAULT_ITEMS_PER_ADVERTISEMENT ? previous : DEFAULT_ITEMS_PER_ADVERTISEMENT
        );
      });
      return;
    }

    const visibleSlotCount = Math.max(2, Math.floor((availableHeight + gap) / slotHeight));
    const nextItemsPerAdvertisement = Math.max(1, visibleSlotCount - 1);

    startTransition(() => {
      setItemsPerAdvertisement((previous) =>
        previous === nextItemsPerAdvertisement ? previous : nextItemsPerAdvertisement
      );
    });
  });

  useLayoutEffect(() => {
    if (!enabled) return;

    let frameId = 0;
    const scheduleMeasurement = () => {
      cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(measureAdvertisementInterval);
    };

    scheduleMeasurement();

    const visualViewport = window.visualViewport;
    const resizeObserver =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(() => scheduleMeasurement()) : undefined;
    const observedElements = [
      mainRef.current,
      bottomNavRef.current,
      firstItemRef.current,
      secondItemRef.current,
    ].filter((element): element is HTMLElement => element !== null);

    observedElements.forEach((element) => resizeObserver?.observe(element));

    window.addEventListener('resize', scheduleMeasurement);
    window.addEventListener('orientationchange', scheduleMeasurement);
    visualViewport?.addEventListener('resize', scheduleMeasurement);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver?.disconnect();
      window.removeEventListener('resize', scheduleMeasurement);
      window.removeEventListener('orientationchange', scheduleMeasurement);
      visualViewport?.removeEventListener('resize', scheduleMeasurement);
    };
  }, [bottomNavRef, enabled, firstItemRef, itemCount, mainRef, secondItemRef]);

  return itemsPerAdvertisement;
};
