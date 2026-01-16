import { Suspense } from 'react';
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
    <div className="flex flex-col" style={{ height: 'var(--viewport-height)' }}>
      <Header />
      <Suspense>
        <main
          className={twMerge(
            'bg-background box-border flex min-h-0 flex-1 flex-col pt-11',
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
