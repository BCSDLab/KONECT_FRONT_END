import { useCallback, useEffect, useRef, useState } from 'react';
import { useBeforeUnload, useLocation, useNavigate } from 'react-router-dom';
import { requestNativeBackNavigation } from '@/utils/ts/nativeBridge';

const NATIVE_BACK_REQUEST_EVENT = 'KONECT_NATIVE_BACK_REQUEST';

interface UseTimerExitGuardParams {
  isRunning: boolean;
  stop: () => Promise<void>;
}

type PendingNavigation = { type: 'href'; nextHref: string; replace?: boolean } | { type: 'native-back' };

function getNavigationHref(anchor: HTMLAnchorElement): string | null {
  if (!anchor.href || anchor.target === '_blank' || anchor.hasAttribute('download')) {
    return null;
  }

  const nextUrl = new URL(anchor.href, window.location.href);
  if (nextUrl.origin !== window.location.origin) {
    return null;
  }

  const nextHref = `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`;
  const currentHref = `${window.location.pathname}${window.location.search}${window.location.hash}`;

  return nextHref === currentHref ? null : nextHref;
}

export function useTimerExitGuard({ isRunning, stop }: UseTimerExitGuardParams) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentHrefRef = useRef(`${location.pathname}${location.search}${location.hash}`);
  const pendingNavigationRef = useRef<PendingNavigation | null>(null);
  const allowNextPopStateRef = useRef(false);
  const stopRef = useRef(stop);
  const [isExitConfirmOpen, setIsExitConfirmOpen] = useState(false);

  useEffect(() => {
    currentHrefRef.current = `${location.pathname}${location.search}${location.hash}`;
  }, [location.hash, location.pathname, location.search]);

  useEffect(() => {
    stopRef.current = stop;
  }, [stop]);

  const openExitConfirm = useCallback((pendingNavigation: PendingNavigation) => {
    if (pendingNavigationRef.current) return;

    pendingNavigationRef.current = pendingNavigation;
    setIsExitConfirmOpen(true);
  }, []);

  const closeExitConfirm = useCallback(() => {
    pendingNavigationRef.current = null;
    setIsExitConfirmOpen(false);
  }, []);

  const confirmExit = useCallback(async () => {
    const pendingNavigation = pendingNavigationRef.current;
    if (!pendingNavigation) return;

    pendingNavigationRef.current = null;
    setIsExitConfirmOpen(false);

    await stopRef.current();

    if (pendingNavigation.type === 'href') {
      navigate(pendingNavigation.nextHref, { replace: pendingNavigation.replace });
      return;
    }

    allowNextPopStateRef.current = true;
    requestNativeBackNavigation();
  }, [navigate]);

  useEffect(() => {
    if (!isRunning) return;

    const handleDocumentClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest('a[href]');
      if (!(anchor instanceof HTMLAnchorElement)) return;

      const nextHref = getNavigationHref(anchor);
      if (!nextHref) return;

      event.preventDefault();
      openExitConfirm({ type: 'href', nextHref });
    };

    document.addEventListener('click', handleDocumentClick, true);
    return () => {
      document.removeEventListener('click', handleDocumentClick, true);
    };
  }, [isRunning, openExitConfirm]);

  useEffect(() => {
    if (!isRunning) return;

    const handlePopState = () => {
      if (allowNextPopStateRef.current) {
        allowNextPopStateRef.current = false;
        return;
      }

      const nextHref = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      const currentHref = currentHrefRef.current;

      if (nextHref === currentHref) return;

      if (pendingNavigationRef.current) {
        allowNextPopStateRef.current = true;
        window.history.go(1);
        return;
      }

      window.history.pushState(window.history.state, '', currentHref);
      openExitConfirm({ type: 'href', nextHref, replace: true });
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isRunning, openExitConfirm]);

  useEffect(() => {
    if (!isRunning) return;

    const handleNativeBackRequest = () => {
      openExitConfirm({ type: 'native-back' });
    };

    window.addEventListener(NATIVE_BACK_REQUEST_EVENT, handleNativeBackRequest);
    return () => {
      window.removeEventListener(NATIVE_BACK_REQUEST_EVENT, handleNativeBackRequest);
    };
  }, [isRunning, openExitConfirm]);

  useBeforeUnload(
    (event) => {
      if (!isRunning) return;

      event.preventDefault();
      event.returnValue = '';
    },
    { capture: true }
  );

  return {
    isExitConfirmOpen,
    closeExitConfirm,
    confirmExit,
  };
}
