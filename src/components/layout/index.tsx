import { Suspense } from 'react';
import type { CSSProperties } from 'react';
import { Outlet } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import BottomNav from './BottomNav';
import Header from './Header';

interface LayoutProps {
  showBottomNav?: boolean;
  contentClassName?: string;
}

export default function Layout({ showBottomNav = false, contentClassName }: LayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <Suspense>
        <main
          className={twMerge(
            'bg-background flex flex-1 flex-col overflow-y-auto pt-(--layout-pt) pb-(--layout-pb)',
            contentClassName
          )}
          style={
            {
              '--layout-pt': 'calc(var(--header-h) + var(--sat))',
              '--layout-pb': showBottomNav ? 'calc(var(--bottom-nav-h) + var(--sab))' : '0px',
            } as CSSProperties
          }
        >
          <Outlet />
        </main>
      </Suspense>
      {showBottomNav && <BottomNav />}
    </div>
  );
}
