import { useEffect, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { SERVER_ERROR_PATH } from '@/utils/ts/errorRedirect';

interface AuthGuardProps {
  children: ReactNode;
}

const PROTECTED_ROUTE_PREFIXES = [
  '/home',
  '/mypage',
  '/timer',
  '/clubs',
  '/schedule',
  '/profile',
  '/council',
  '/chats',
];

function isProtectedPath(pathname: string) {
  return PROTECTED_ROUTE_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function AuthGuard({ children }: AuthGuardProps) {
  const { pathname } = useLocation();
  const { isLoading, initialize } = useAuthStore();
  const shouldSkipInitialize = pathname === SERVER_ERROR_PATH;
  const shouldBlockWhileInitializing = !shouldSkipInitialize && isProtectedPath(pathname);

  useEffect(() => {
    if (shouldSkipInitialize) return;

    initialize();
  }, [initialize, shouldSkipInitialize]);

  // Public routes can paint immediately while auth restore runs in the background.
  if (isLoading && shouldBlockWhileInitializing) {
    return (
      <div role="status" className="flex h-screen items-center justify-center">
        <span className="sr-only">로딩 중…</span>
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
      </div>
    );
  }

  return children;
}

export default AuthGuard;
