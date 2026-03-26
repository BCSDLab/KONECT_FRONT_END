import { Suspense, useMemo, type CSSProperties } from 'react';
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

interface LayoutProps {
  showBottomNav?: boolean;
  contentClassName?: string;
}

export default function Layout({ showBottomNav = false, contentClassName }: LayoutProps) {
  const { pathname } = useLocation();
  const { contentPaddingClassName, hasHeader } = getHeaderPresentation(pathname);
  const { bottomNavRef, bottomOverlayInset, handleLayoutElement, layoutElement, mainRef } =
    useLayoutElements(showBottomNav);
  const layoutElements = useMemo(
    () => ({
      layoutElement,
      mainRef,
      bottomNavRef,
      bottomOverlayInset,
    }),
    [bottomNavRef, bottomOverlayInset, layoutElement, mainRef]
  );
  const layoutStyle = {
    height: 'var(--viewport-height)',
    transform: 'translateY(var(--viewport-offset))',
    '--subpage-header-height': SUBPAGE_HEADER_HEIGHT,
    '--layout-bottom-overlay-inset': bottomOverlayInset,
  } as CSSProperties;
  const mainStyle = showBottomNav
    ? ({ paddingBottom: 'var(--layout-bottom-overlay-inset)' } as CSSProperties)
    : undefined;

  return (
    <LayoutElementsContext.Provider value={layoutElements}>
      <div ref={handleLayoutElement} className="fixed inset-0 flex flex-col overflow-hidden" style={layoutStyle}>
        {hasHeader && <Header />}
        <main
          ref={mainRef}
          style={mainStyle}
          className={cn(
            'bg-background box-border flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
            hasHeader && contentPaddingClassName,
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
