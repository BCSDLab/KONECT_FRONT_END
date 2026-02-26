import { StrictMode } from 'react';
import * as Sentry from '@sentry/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';
import './index.css';
import { initSentry } from './config/sentry.ts';
import ToastProvider from './contexts/ToastContext';
import { installViewportVars } from './utils/ts/viewport.ts';

installViewportVars();
initSentry();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: true,
      retry: false,
    },
  },
});

async function bootstrap() {
  const { default: App } = await import('./App.tsx');

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Sentry.ErrorBoundary
        fallback={
          <div className="flex min-h-screen items-center justify-center px-6 text-center">
            <div className="space-y-3">
              <p className="text-label2 text-slate-900">Something went wrong.</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="text-label3 rounded-lg bg-indigo-600 px-4 py-2 text-white"
              >
                Reload
              </button>
            </div>
          </div>
        }
      >
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            <App />
          </ToastProvider>
        </QueryClientProvider>
      </Sentry.ErrorBoundary>
    </StrictMode>
  );
}

void bootstrap();
