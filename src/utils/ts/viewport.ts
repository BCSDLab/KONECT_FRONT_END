export function installViewportVars() {
  let scheduled = false;

  const setViewportHeight = () => {
    const vv = window.visualViewport;
    const h = vv?.height ?? window.innerHeight;
    const offset = Math.max(0, vv?.offsetTop ?? 0);
    document.documentElement.style.setProperty('--viewport-height', `${h}px`);
    document.documentElement.style.setProperty('--viewport-offset', `${offset}px`);
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

  window.addEventListener('resize', requestSetViewportHeight);
  window.addEventListener('orientationchange', requestSetViewportHeight);
  window.addEventListener('pageshow', requestSetViewportHeight);

  window.visualViewport?.addEventListener('resize', requestSetViewportHeight);
  window.visualViewport?.addEventListener('scroll', requestSetViewportHeight);

  window.addEventListener('focusin', requestSetViewportHeight);
  window.addEventListener('focusout', requestSetViewportHeight);

  return () => {
    window.removeEventListener('resize', requestSetViewportHeight);
    window.removeEventListener('orientationchange', requestSetViewportHeight);
    window.removeEventListener('pageshow', requestSetViewportHeight);

    window.visualViewport?.removeEventListener('resize', requestSetViewportHeight);
    window.visualViewport?.removeEventListener('scroll', requestSetViewportHeight);

    window.removeEventListener('focusin', requestSetViewportHeight);
    window.removeEventListener('focusout', requestSetViewportHeight);
  };
}
