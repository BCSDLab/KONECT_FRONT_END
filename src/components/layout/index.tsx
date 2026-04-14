import { Suspense, useMemo, useRef, type CSSProperties } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import RouteLoadingFallback from '@/components/common/RouteLoadingFallback';
import InboxNotificationLayer from '@/components/notification/InboxNotificationLayer';
import { LayoutElementsContext } from '@/contexts/useLayoutElementsContext';
import { cn } from '@/utils/ts/cn';
import BottomNav from './BottomNav';
import Header from './Header';
import { SUBPAGE_HEADER_HEIGHT } from './Header/constants';
import { getHeaderPresentation } from './Header/presentation';
import { useLayoutElements } from './hooks/useLayoutElements';
import { useLayoutHeaderInset } from './hooks/useLayoutHeaderInset';

interface LayoutProps {
  showBottomNav?: boolean;
  contentClassName?: string;
}

export default function Layout({ showBottomNav = false, contentClassName }: LayoutProps) {
  const { pathname } = useLocation();
  const { hasHeader } = getHeaderPresentation(pathname);
  const isChatRoomPage = pathname.startsWith('/chats/') && pathname !== '/chats';
  const mainBackgroundClassName = 'bg-background';
  const headerRef = useRef<HTMLElement>(null);
  const { bottomNavRef, bottomOverlayInset, bottomOverlayInsetPx, handleLayoutElement, layoutElement, mainRef } =
    useLayoutElements(showBottomNav);
  const headerInset = useLayoutHeaderInset({ hasHeader, headerRef, pathname });
  const layoutElements = useMemo(
    () => ({
      layoutElement,
      mainRef,
      bottomNavRef,
      bottomOverlayInset,
      bottomOverlayInsetPx,
    }),
    [bottomNavRef, bottomOverlayInset, bottomOverlayInsetPx, layoutElement, mainRef]
  );
  const layoutStyle = {
    height: 'var(--viewport-height)',
    transform: 'translateY(var(--viewport-offset))',
    '--subpage-header-height': SUBPAGE_HEADER_HEIGHT,
    '--layout-bottom-overlay-inset': bottomOverlayInset,
  } as CSSProperties;
  const mainStyle = showBottomNav
    ? ({
        paddingTop: headerInset,
        paddingBottom: 'var(--layout-bottom-overlay-inset)',
      } as CSSProperties)
    : hasHeader
      ? ({ paddingTop: headerInset } as CSSProperties)
      : undefined;

  return (
    <LayoutElementsContext.Provider value={layoutElements}>
      <div ref={handleLayoutElement} className="fixed inset-0 flex flex-col overflow-hidden" style={layoutStyle}>
        {hasHeader && <Header headerRef={headerRef} />}
        <main
          ref={mainRef}
          style={mainStyle}
          className={cn(
            'scrollbar-hidden box-border flex min-h-0 flex-1 flex-col',
            isChatRoomPage ? 'overflow-hidden' : 'overflow-y-auto overscroll-contain',
            mainBackgroundClassName,
            contentClassName
          )}
        >
          <Suspense fallback={<RouteLoadingFallback />}>
            <Outlet />
          </Suspense>
        </main>
        {showBottomNav && <BottomNav navRef={bottomNavRef} />}
        <InboxNotificationLayer />
      </div>
    </LayoutElementsContext.Provider>
  );
}
