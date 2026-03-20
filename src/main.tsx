import { StrictMode } from 'react';
import * as Sentry from '@sentry/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';
import { useAuthStore } from '@/stores/authStore';
import { SERVER_ERROR_PATH } from '@/utils/ts/errorRedirect';
import './index.css';
import { initSentry } from './config/sentry.ts';
import ToastProvider from './contexts/ToastContext';
import { isApiError } from './interface/error.ts';
import { installViewportVars } from './utils/ts/viewport.ts';

installViewportVars();
initSentry();

const appImportPromise = import('./App.tsx');

function startSessionRestore() {
  void useAuthStore.getState().initialize();
}

if (window.location.pathname !== SERVER_ERROR_PATH) {
  startSessionRestore();
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: true,
      retry: (failureCount, error) => {
        const maxRetries = 2;
        return failureCount <= maxRetries && isApiError(error) && error.status === 0;
      },
    },
  },
});

async function bootstrap() {
  const { default: App } = await appImportPromise;

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Sentry.ErrorBoundary
        fallback={
          <div className="flex min-h-screen items-center justify-center px-6 text-center">
            <div className="space-y-3">
              <p className="text-body2 text-slate-900">Something went wrong.</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="text-body3-strong rounded-lg bg-indigo-600 px-4 py-2 text-white"
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
