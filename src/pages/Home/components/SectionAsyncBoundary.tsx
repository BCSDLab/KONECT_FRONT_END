import { type ReactElement, type ReactNode, Suspense } from 'react';
import * as Sentry from '@sentry/react';
import SectionErrorFallback from '@/pages/Home/components/SectionErrorFallback';

interface SectionAsyncBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
  errorFallback?: ReactElement;
}

function SectionAsyncBoundary({
  children,
  fallback,
  errorFallback = <SectionErrorFallback />,
}: SectionAsyncBoundaryProps) {
  return (
    <Sentry.ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={fallback}>{children}</Suspense>
    </Sentry.ErrorBoundary>
  );
}

export default SectionAsyncBoundary;
