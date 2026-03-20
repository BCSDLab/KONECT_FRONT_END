import { create } from 'zustand';
import { getMyInfo, refreshAccessToken } from '@/apis/auth';
import type { MyInfoResponse } from '@/apis/auth/entity';

let initializePromise: Promise<void> | null = null;
let hydrateUserPromise: Promise<void> | null = null;

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

      useAuthStore.setState({ user: null, accessToken: null, isAuthenticated: false });
    } finally {
      hydrateUserPromise = null;
    }
  })();

  return hydrateUserPromise;
};

interface AuthState {
  user: MyInfoResponse | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  initialize: () => Promise<void>;
  setUser: (user: MyInfoResponse | null) => void;
  setAccessToken: (token: string | null) => void;
  getAccessToken: () => string | null;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,

  initialize: async () => {
    const { accessToken, isAuthenticated, user } = get();
    const hasValidAccessToken = !isAccessTokenExpired(accessToken);

    if (user) {
      if (hasValidAccessToken) {
        set({ isAuthenticated: true, isLoading: false });
        return;
      }
    }

    if (isAuthenticated && accessToken && hasValidAccessToken) {
      set({ isLoading: false });
      void hydrateUser(accessToken);
      return;
    }

    if (initializePromise) {
      return initializePromise;
    }

    initializePromise = (async () => {
      try {
        const nextAccessToken = await refreshAccessToken();

        // Open protected routes as soon as the access token is restored.
        set({ accessToken: nextAccessToken, isAuthenticated: true, isLoading: false });
        void hydrateUser(nextAccessToken);
      } catch {
        set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
      } finally {
        initializePromise = null;
      }
    })();

    return initializePromise;
  },

  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),

  setAccessToken: (token) => set({ accessToken: token }),

  getAccessToken: () => get().accessToken,

  clearAuth: () => {
    initializePromise = null;
    hydrateUserPromise = null;
    set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
  },
}));
