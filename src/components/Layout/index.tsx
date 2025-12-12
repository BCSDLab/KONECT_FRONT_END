import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import Header from './Header';

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Suspense>
        <div className="bg-background flex flex-1 flex-col overflow-y-auto pt-12">
          <Outlet />
        </div>
      </Suspense>
    </div>
  );
}

export function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Suspense>
        <div className="bg-indigo-0 flex flex-1 flex-col overflow-y-auto pt-12">
          <Outlet />
        </div>
      </Suspense>
    </div>
  );
}

export function HomeLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Suspense>
        <div className="bg-background flex flex-1 flex-col overflow-y-auto pt-12">
          <Outlet />
        </div>
      </Suspense>
      <BottomNav />
    </div>
  );
}
