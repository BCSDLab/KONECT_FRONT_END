import { useLayoutEffect, useState, type RefObject } from 'react';

interface UseLayoutHeaderInsetParams {
  hasHeader: boolean;
  headerRef: RefObject<HTMLElement | null>;
  pathname: string;
}

export function useLayoutHeaderInset({ hasHeader, headerRef, pathname }: UseLayoutHeaderInsetParams) {
  const [headerInset, setHeaderInset] = useState('0px');

  useLayoutEffect(() => {
    if (!hasHeader) {
      return;
    }

    const measureInset = () => {
      const nextInset = `${Math.ceil(headerRef.current?.getBoundingClientRect().height ?? 0)}px`;

      setHeaderInset((previousInset) => (previousInset === nextInset ? previousInset : nextInset));
    };

    measureInset();

    const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measureInset) : undefined;
    const headerElement = headerRef.current;
    const visualViewport = window.visualViewport;

    if (headerElement) {
      resizeObserver?.observe(headerElement);
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
  }, [hasHeader, headerRef, pathname]);

  return headerInset;
}
