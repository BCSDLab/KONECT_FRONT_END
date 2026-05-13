import { Navigate, Outlet } from 'react-router-dom';
import RouteLoadingFallback from '@/components/common/RouteLoadingFallback';
import { useAuthStore } from '@/stores/authStore';

function ProtectedRoute() {
  const authStatus = useAuthStore((state) => state.authStatus);

  if (authStatus === 'unknown') {
    return <RouteLoadingFallback fullScreen />;
  }

  if (authStatus === 'anonymous') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
