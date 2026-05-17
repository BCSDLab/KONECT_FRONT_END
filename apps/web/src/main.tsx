import { StrictMode } from 'react';
import { isNetworkError, isTimeoutError } from '@konect/utils/api-error';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';

import App from './App.tsx';

import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: true,
      retry: (failureCount, error) => {
        const maxRetries = 2;
        return failureCount <= maxRetries && (isNetworkError(error) || isTimeoutError(error));
      },
    },
  },
});

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StrictMode>
  );
}
