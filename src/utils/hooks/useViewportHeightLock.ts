import { useLayoutEffect } from 'react';
import { isTextInputElement } from '@/utils/ts/dom';

const SCROLL_RESET_TIMEOUT_MS = 180;

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

    const resetDocumentScroll = () => {
      window.scrollTo(0, 0);
      root.scrollTop = 0;
      body.scrollTop = 0;

      if (scrollingElement) {
        scrollingElement.scrollTop = 0;
      }
    };

    // iOS Safari는 focus와 visualViewport 갱신 뒤에 문서 스크롤을 비동기로 다시 적용할 수 있습니다.
    // 즉시 1번, 두 번의 animation frame, 그리고 기기 테스트 기반의 짧은 휴리스틱 timeout으로
    // 한 번 더 복구해 뒤늦게 들어오는 브라우저 스크롤도 최대한 잡습니다.
    const scheduleDocumentScrollReset = () => {
      cancelAnimationFrame(resetFrameId);
      cancelAnimationFrame(trailingResetFrameId);
      clearTimeout(resetTimeoutId);

      resetDocumentScroll();
      resetFrameId = requestAnimationFrame(() => {
        resetDocumentScroll();
        trailingResetFrameId = requestAnimationFrame(resetDocumentScroll);
      });
      resetTimeoutId = window.setTimeout(resetDocumentScroll, SCROLL_RESET_TIMEOUT_MS);
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
      const currentScrollTop = Math.max(
        scrollingElement?.scrollTop ?? 0,
        root.scrollTop,
        body.scrollTop,
        window.scrollY
      );

      if (currentScrollTop > 0) {
        scheduleDocumentScrollReset();
      }
    };

    root.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    body.style.height = 'var(--viewport-height)';
    root.style.height = 'var(--viewport-height)';
    scheduleDocumentScrollReset();

    // installViewportVars는 같은 신호로 CSS 변수를 갱신하고,
    // 이 훅은 ChatRoom에서 문서 스크롤 복구를 위해 의도적으로 한 번 더 사용합니다.
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
