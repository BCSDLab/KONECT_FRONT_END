export function installViewportVars() {
  const setVars = () => {
    const vv = window.visualViewport;
    const h = vv?.height ?? window.innerHeight;
    document.documentElement.style.setProperty('--viewport-height', `${h}px`);

    // safe-area-inset-bottom 계산
    const el = document.createElement('div');
    el.style.cssText = 'position:fixed;bottom:0;padding-bottom:env(safe-area-inset-bottom)';
    document.body.appendChild(el);
    const sab = getComputedStyle(el).paddingBottom;
    document.body.removeChild(el);
    document.documentElement.style.setProperty('--sab', sab);
  };

  setVars();

  // 초기 진입에서 주소창/시스템 UI 반영 타이밍 한번 더
  requestAnimationFrame(() => requestAnimationFrame(setVars));

  window.addEventListener('resize', setVars);
  window.addEventListener('orientationchange', setVars);
  window.addEventListener('pageshow', setVars);

  // 주소창 접힘/펼침, 키보드 등
  window.visualViewport?.addEventListener('resize', setVars);
  window.visualViewport?.addEventListener('scroll', setVars);

  window.addEventListener('focusin', setVars);
  window.addEventListener('focusout', setVars);

  // cleanup 필요하면 반환
  return () => {
    window.removeEventListener('resize', setVars);
    window.removeEventListener('orientationchange', setVars);
    window.removeEventListener('pageshow', setVars);

    window.visualViewport?.removeEventListener('resize', setVars);
    window.visualViewport?.removeEventListener('scroll', setVars);

    window.removeEventListener('focusin', setVars);
    window.removeEventListener('focusout', setVars);
  };
}
