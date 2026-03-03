import { useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { SERVER_ERROR_PATH } from '@/utils/ts/errorRedirect';

interface AuthGuardProps {
  children: ReactNode;
}

function AuthGuard({ children }: AuthGuardProps) {
  const { pathname } = useLocation();
  const { isLoading, initialize } = useAuthStore();
  const shouldSkipInitialize = pathname === SERVER_ERROR_PATH;

  useEffect(() => {
    if (shouldSkipInitialize) return;

    initialize();
  }, [initialize, shouldSkipInitialize]);

  if (isLoading && !shouldSkipInitialize) {
    return (
      <div role="status" className="flex h-screen items-center justify-center">
        <span className="sr-only">Loading…</span>
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  return children;
}

export default AuthGuard;
