import { create } from 'zustand';
import { getMyInfo, refreshAccessToken } from '@/apis/auth';
import type { MyInfoResponse } from '@/apis/auth/entity';

let initializePromise: Promise<void> | null = null;
let hydrateUserPromise: Promise<void> | null = null;

export type AuthStatus = 'unknown' | 'authenticated' | 'anonymous';

const isAccessTokenExpired = (accessToken: string | null) => {
  if (!accessToken) return true;

  const [, payload] = accessToken.split('.');
  if (!payload) return true;

  try {
    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padding = '='.repeat((4 - (normalizedPayload.length % 4)) % 4);
    const parsedPayload = JSON.parse(atob(`${normalizedPayload}${padding}`)) as { exp?: number };

    return typeof parsedPayload.exp !== 'number' || parsedPayload.exp * 1000 <= Date.now();
  } catch {
    return true;
  }
};

const hydrateUser = async (nextAccessToken: string) => {
  if (hydrateUserPromise) return hydrateUserPromise;

  hydrateUserPromise = (async () => {
    try {
      const nextUser = await getMyInfo();

      if (useAuthStore.getState().accessToken !== nextAccessToken) return;

      useAuthStore.setState({ user: nextUser });

      try {
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(
            JSON.stringify({ type: 'LOGIN_COMPLETE', accessToken: nextAccessToken })
          );
        }
      } catch {
        // 브릿지 전달 실패가 인증 성공 상태를 롤백시키지 않도록 무시
      }
    } catch {
      if (useAuthStore.getState().accessToken !== nextAccessToken) return;

      // Profile hydration can fail independently of session recovery.
      useAuthStore.setState({ user: null });
    } finally {
      hydrateUserPromise = null;
    }
  })();

  return hydrateUserPromise;
};

interface AuthState {
  user: MyInfoResponse | null;
  accessToken: string | null;
  authStatus: AuthStatus;
  initialize: () => Promise<void>;
  setUser: (user: MyInfoResponse | null) => void;
  setAccessToken: (token: string | null) => void;
  getAccessToken: () => string | null;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  authStatus: 'unknown',

  initialize: async () => {
    const { accessToken, authStatus, user } = get();
    const hasValidAccessToken = !isAccessTokenExpired(accessToken);

    if (user) {
      if (hasValidAccessToken) {
        set({ authStatus: 'authenticated' });
        return;
      }
    }

    if (authStatus === 'authenticated' && accessToken && hasValidAccessToken) {
      void hydrateUser(accessToken);
      return;
    }

    if (accessToken && hasValidAccessToken) {
      set({ authStatus: 'authenticated' });
      void hydrateUser(accessToken);
      return;
    }

    if (authStatus === 'anonymous') {
      return;
    }

    if (initializePromise) {
      return initializePromise;
    }

    initializePromise = (async () => {
      try {
        const nextAccessToken = await refreshAccessToken();

        // Open protected routes as soon as the access token is restored.
        set({ accessToken: nextAccessToken, authStatus: 'authenticated' });
        void hydrateUser(nextAccessToken);
      } catch {
        set({ user: null, accessToken: null, authStatus: 'anonymous' });
      } finally {
        initializePromise = null;
      }
    })();

    return initializePromise;
  },

  setUser: (user) =>
    set((state) => ({
      user,
      authStatus: user || state.accessToken ? 'authenticated' : 'anonymous',
    })),

  setAccessToken: (token) =>
    set((state) => ({
      accessToken: token,
      authStatus: token || state.user ? 'authenticated' : 'anonymous',
    })),

  getAccessToken: () => get().accessToken,

  clearAuth: () => {
    initializePromise = null;
    hydrateUserPromise = null;
    set({ user: null, accessToken: null, authStatus: 'anonymous' });
  },
}));
