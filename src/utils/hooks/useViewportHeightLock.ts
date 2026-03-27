import { useLayoutEffect } from 'react';

function useViewportHeightLock() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const scrollingElement = document.scrollingElement as HTMLElement | null;
    const prevBodyOverflow = body.style.overflow;
    const prevBodyHeight = body.style.height;
    const prevRootOverflow = root.style.overflow;
    const prevRootHeight = root.style.height;
    let isEditableFocused = false;
    let resetFrameId = 0;
    let trailingResetFrameId = 0;
    let resetTimeoutId = 0;

    const isTextInputElement = (element: EventTarget | null): element is HTMLElement => {
      if (!(element instanceof HTMLElement)) return false;

      return element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element.isContentEditable;
    };

    const resetDocumentScroll = () => {
      window.scrollTo(0, 0);
      root.scrollTop = 0;
      body.scrollTop = 0;

      if (scrollingElement) {
        scrollingElement.scrollTop = 0;
      }
    };

    const scheduleDocumentScrollReset = () => {
      cancelAnimationFrame(resetFrameId);
      cancelAnimationFrame(trailingResetFrameId);
      clearTimeout(resetTimeoutId);

      resetDocumentScroll();
      resetFrameId = requestAnimationFrame(() => {
        resetDocumentScroll();
        trailingResetFrameId = requestAnimationFrame(resetDocumentScroll);
      });
      resetTimeoutId = window.setTimeout(resetDocumentScroll, 180);
    };

    const handleFocusIn = (event: FocusEvent) => {
      isEditableFocused = isTextInputElement(event.target);

      if (isEditableFocused) {
        scheduleDocumentScrollReset();
      }
    };

    const handleFocusOut = (event: FocusEvent) => {
      if (!isTextInputElement(event.target)) return;

      isEditableFocused = false;
      scheduleDocumentScrollReset();
    };

    const handleViewportChange = () => {
      if (isEditableFocused) {
        scheduleDocumentScrollReset();
      }
    };

    const handleWindowScroll = () => {
      const currentScrollTop = scrollingElement?.scrollTop ?? root.scrollTop ?? body.scrollTop ?? window.scrollY;

      if (currentScrollTop > 0) {
        scheduleDocumentScrollReset();
      }
    };

    root.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    body.style.height = 'var(--viewport-height)';
    root.style.height = 'var(--viewport-height)';
    scheduleDocumentScrollReset();

    window.addEventListener('focusin', handleFocusIn);
    window.addEventListener('focusout', handleFocusOut);
    window.addEventListener('scroll', handleWindowScroll, { passive: true });

    window.visualViewport?.addEventListener('resize', handleViewportChange);
    window.visualViewport?.addEventListener('scroll', handleViewportChange);

    return () => {
      cancelAnimationFrame(resetFrameId);
      cancelAnimationFrame(trailingResetFrameId);
      clearTimeout(resetTimeoutId);

      window.removeEventListener('focusin', handleFocusIn);
      window.removeEventListener('focusout', handleFocusOut);
      window.removeEventListener('scroll', handleWindowScroll);

      window.visualViewport?.removeEventListener('resize', handleViewportChange);
      window.visualViewport?.removeEventListener('scroll', handleViewportChange);

      root.style.overflow = prevRootOverflow;
      body.style.overflow = prevBodyOverflow;
      body.style.height = prevBodyHeight;
      root.style.height = prevRootHeight;
    };
  }, []);
}

export default useViewportHeightLock;
