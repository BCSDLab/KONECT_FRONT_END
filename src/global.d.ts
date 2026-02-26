interface Window {
  ReactNativeWebView?: {
    postMessage: (message: string) => void;
  };
}

interface ImportMetaEnv {
  readonly VITE_API_PATH: string;
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_SENTRY_ENABLED?: 'true' | 'false';
  readonly VITE_SENTRY_ENVIRONMENT?: string;
  readonly VITE_SENTRY_RELEASE?: string;
  readonly VITE_SENTRY_TRACES_SAMPLE_RATE?: string;
  readonly VITE_SENTRY_REPLAY_SESSION_SAMPLE_RATE?: string;
  readonly VITE_SENTRY_REPLAY_ON_ERROR_SAMPLE_RATE?: string;
  readonly VITE_SENTRY_DEBUG_TRANSACTIONS?: 'true' | 'false';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
