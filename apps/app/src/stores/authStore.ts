import { create } from 'zustand';
import { getMyInfo, refreshAccessToken } from '@/apis/auth';
import type { MyInfoResponse } from '@/apis/auth/entity';
import { isAccessTokenExpired } from '@/utils/ts/accessToken';
import { postNativeMessage } from '@/utils/ts/nativeBridge';

let initializePromise: Promise<void> | null = null;
let hydrateUserPromise: Promise<void> | null = null;

export type AuthStatus = 'unknown' | 'authenticated' | 'anonymous';

const hydrateUser = async (nextAccessToken: string) => {
  if (hydrateUserPromise) return hydrateUserPromise;

  hydrateUserPromise = (async () => {
    try {
      const nextUser = await getMyInfo();

      if (useAuthStore.getState().accessToken !== nextAccessToken) return;

      useAuthStore.setState({ user: nextUser });

      postNativeMessage({ type: 'LOGIN_COMPLETE', accessToken: nextAccessToken });
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
  clearAuthAndNotifyNative: () => void;
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
      hydrateUser(accessToken);
      return;
    }

    if (accessToken && hasValidAccessToken) {
      set({ authStatus: 'authenticated' });
      hydrateUser(accessToken);
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
        hydrateUser(nextAccessToken);
      } catch {
        get().clearAuth();
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

  clearAuthAndNotifyNative: () => {
    get().clearAuth();
    postNativeMessage({ type: 'LOGOUT' });
  },
}));
