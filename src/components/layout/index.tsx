import { Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import BottomNav from './BottomNav';
import Header from './Header';
import { HEADER_CONFIGS } from './Header/headerConfig';

interface LayoutProps {
  showBottomNav?: boolean;
  contentClassName?: string;
}

export default function Layout({ showBottomNav = false, contentClassName }: LayoutProps) {
  const { pathname } = useLocation();
  const headerConfig = HEADER_CONFIGS.find((config) => config.match(pathname));
  const isInfoHeader = headerConfig?.type === 'info';

  return (
    <div
      className="fixed inset-0 flex flex-col overflow-hidden"
      style={{ height: 'var(--viewport-height)', transform: 'translateY(var(--viewport-offset))' }}
    >
      <Header />
      <Suspense>
        <main
          className={twMerge(
            'bg-background box-border flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain',
            isInfoHeader ? 'pt-15' : 'pt-11',
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
