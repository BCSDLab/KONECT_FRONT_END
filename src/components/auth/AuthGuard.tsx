import { useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

interface AuthGuardProps {
  children: ReactNode;
}

function AuthGuard({ children }: AuthGuardProps) {
  const { pathname } = useLocation();
  const { isLoading, initialize } = useAuthStore();
  const shouldSkipInitialize = pathname === '/server-error';

  useEffect(() => {
    if (shouldSkipInitialize) return;

    initialize();
  }, [initialize, shouldSkipInitialize]);

  if (isLoading && !shouldSkipInitialize) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  return children;
}

export default AuthGuard;
