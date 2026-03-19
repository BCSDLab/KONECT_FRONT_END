import { Suspense, type CSSProperties } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import RouteLoadingFallback from '@/components/common/RouteLoadingFallback';
import { cn } from '@/utils/ts/cn';
import BottomNav from './BottomNav';
import Header from './Header';
import { MANAGER_HEADER_HEIGHT } from './Header/constants';
import { HEADER_CONFIGS } from './Header/headerConfig';

interface LayoutProps {
  showBottomNav?: boolean;
  contentClassName?: string;
}

export default function Layout({ showBottomNav = false, contentClassName }: LayoutProps) {
  const { pathname } = useLocation();
  const headerConfig = HEADER_CONFIGS.find((config) => config.match(pathname));
  const headerType = headerConfig?.type;
  const isInfoHeader = headerType === 'info';
  const isManagerHeader = headerType === 'manager';
  const hasHeader = headerType !== 'none';
  const layoutStyle = {
    height: 'var(--viewport-height)',
    transform: 'translateY(var(--viewport-offset))',
    '--manager-header-height': MANAGER_HEADER_HEIGHT,
  } as CSSProperties;

  return (
    <div className="fixed inset-0 flex flex-col overflow-hidden" style={layoutStyle}>
      {hasHeader && <Header />}
      <Suspense fallback={<RouteLoadingFallback />}>
        <main
          className={cn(
            'bg-background box-border flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
            hasHeader && (isInfoHeader ? 'pt-15' : isManagerHeader ? 'pt-(--manager-header-height)' : 'pt-11'),
            showBottomNav && 'pb-19',
            contentClassName
          )}
        >
          <Outlet />
        </main>
      </Suspense>
      {showBottomNav && <BottomNav />}
    </div>
  );
}
