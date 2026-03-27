import { isTextInputElement } from '@/utils/ts/dom';

const KEYBOARD_OPEN_THRESHOLD_PX = 120;

export function installViewportVars() {
  let scheduled = false;
  let isEditableFocused = false;
  let restingViewportHeight = 0;
  let restingViewportWidth = 0;

  const setViewportHeight = () => {
    const vv = window.visualViewport;
    const h = vv?.height ?? window.innerHeight;
    const w = vv?.width ?? window.innerWidth;
    const offset = Math.max(0, vv?.offsetTop ?? 0);
    const root = document.documentElement;
    const hasViewportContextChanged = Math.abs(restingViewportWidth - w) > 80;

    if (!isEditableFocused || !restingViewportHeight || hasViewportContextChanged) {
      restingViewportHeight = h;
      restingViewportWidth = w;
    }

    const keyboardHeight = Math.max(0, restingViewportHeight - h);
    const isKeyboardOpen = isEditableFocused && keyboardHeight > KEYBOARD_OPEN_THRESHOLD_PX;

    root.style.setProperty('--viewport-height', `${h}px`);
    root.style.setProperty('--viewport-offset', isEditableFocused ? '0px' : `${offset}px`);
    root.style.setProperty('--effective-bottom-safe-area', isKeyboardOpen ? '0px' : 'var(--sab)');
  };

  const requestSetViewportHeight = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      setViewportHeight();
    });
  };

  setViewportHeight();
  requestAnimationFrame(() => requestAnimationFrame(setViewportHeight));

  const handleFocusIn = (event: FocusEvent) => {
    isEditableFocused = isTextInputElement(event.target);
    requestSetViewportHeight();
  };

  const handleFocusOut = (event: FocusEvent) => {
    if (isTextInputElement(event.target)) {
      isEditableFocused = false;
      requestSetViewportHeight();
    }
  };

  window.addEventListener('resize', requestSetViewportHeight);
  window.addEventListener('orientationchange', requestSetViewportHeight);
  window.addEventListener('pageshow', requestSetViewportHeight);

  window.visualViewport?.addEventListener('resize', requestSetViewportHeight);
  window.visualViewport?.addEventListener('scroll', requestSetViewportHeight);

  window.addEventListener('focusin', handleFocusIn);
  window.addEventListener('focusout', handleFocusOut);

  return () => {
    window.removeEventListener('resize', requestSetViewportHeight);
    window.removeEventListener('orientationchange', requestSetViewportHeight);
    window.removeEventListener('pageshow', requestSetViewportHeight);

    window.visualViewport?.removeEventListener('resize', requestSetViewportHeight);
    window.visualViewport?.removeEventListener('scroll', requestSetViewportHeight);

    window.removeEventListener('focusin', handleFocusIn);
    window.removeEventListener('focusout', handleFocusOut);
  };
}
