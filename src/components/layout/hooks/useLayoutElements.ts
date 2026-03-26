import { useCallback, useRef, useState } from 'react';
import { useLayoutBottomOverlayInset } from './useLayoutBottomOverlayInset';

export function useLayoutElements(showBottomNav: boolean) {
  const [layoutElement, setLayoutElement] = useState<HTMLDivElement | null>(null);
  const mainRef = useRef<HTMLElement>(null);
  const bottomNavRef = useRef<HTMLElement>(null);
  const bottomOverlayInset = useLayoutBottomOverlayInset(showBottomNav, bottomNavRef);
  const handleLayoutElement = useCallback((node: HTMLDivElement | null) => {
    setLayoutElement(node);
  }, []);

  return {
    handleLayoutElement,
    layoutElement,
    mainRef,
    bottomNavRef,
    bottomOverlayInset,
  };
}
