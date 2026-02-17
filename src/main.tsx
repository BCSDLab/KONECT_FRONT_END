import { StrictMode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { installViewportVars } from './utils/ts/viewport.ts';
import ToastProvider from './contexts/ToastContext';

installViewportVars();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: true,
      retry: false,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <ToastProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </ToastProvider>
  </QueryClientProvider>
);
