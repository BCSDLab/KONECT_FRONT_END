import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

function PublicRoute() {
  const authStatus = useAuthStore((state) => state.authStatus);

  if (authStatus === 'authenticated') {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
}

export default PublicRoute;
