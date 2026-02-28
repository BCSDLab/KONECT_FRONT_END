import { useEffect } from 'react';
import * as Sentry from '@sentry/react';
import { createRoutesFromChildren, matchRoutes, useLocation, useNavigationType } from 'react-router-dom';

const clampSampleRate = (value: string | undefined, fallback: number): number => {
  if (value == null || value.trim() === '') return fallback;

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;

  if (parsed < 0) return 0;
  if (parsed > 1) return 1;
  return parsed;
};

export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn) return;

  const enabledFromEnv = import.meta.env.VITE_SENTRY_ENABLED;
  const enabled = enabledFromEnv === undefined ? import.meta.env.PROD : enabledFromEnv === 'true';
  const shouldDebugTransactions = import.meta.env.DEV && import.meta.env.VITE_SENTRY_DEBUG_TRANSACTIONS === 'true';

  Sentry.init({
    dsn,
    enabled,
    debug: shouldDebugTransactions,
    environment: import.meta.env.VITE_SENTRY_ENVIRONMENT ?? import.meta.env.MODE,
    release: import.meta.env.VITE_SENTRY_RELEASE,
    integrations: [
      Sentry.reactRouterV7BrowserTracingIntegration({
        useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes,
      }),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    tracePropagationTargets: ['localhost', ...(import.meta.env.VITE_API_PATH ? [import.meta.env.VITE_API_PATH] : [])],
    tracesSampleRate: clampSampleRate(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE, 0.1),
    replaysSessionSampleRate: clampSampleRate(import.meta.env.VITE_SENTRY_REPLAY_SESSION_SAMPLE_RATE, 0.0),
    replaysOnErrorSampleRate: clampSampleRate(import.meta.env.VITE_SENTRY_REPLAY_ON_ERROR_SAMPLE_RATE, 1.0),
    beforeSendTransaction: shouldDebugTransactions
      ? (event) => {
          console.log('[Sentry tx]', event.transaction, event.transaction_info?.source);
          return event;
        }
      : undefined,
  });
}
