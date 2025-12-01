import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <Suspense>
        <div className="flex flex-1 bg-[#fcfcfc] pt-11">
          <Outlet />
        </div>
      </Suspense>
    </div>
  );
}

export default AppLayout;
