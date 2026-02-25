import { create } from 'zustand';
import { getMyInfo, refreshAccessToken } from '@/apis/auth';
import type { MyInfoResponse } from '@/apis/auth/entity';

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
    if (get().user) {
      set({ isLoading: false });
      return;
    }

    try {
      const accessToken = await refreshAccessToken();
      set({ accessToken });

      const user = await getMyInfo();

      set({ user, isAuthenticated: true, isLoading: false });

      try {
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'LOGIN_COMPLETE', accessToken }));
        }
      } catch {
        // 브릿지 전달 실패가 인증 성공 상태를 롤백시키지 않도록 무시
      }
    } catch {
      set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
    }
  },

  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),

  setAccessToken: (token) => set({ accessToken: token }),

  getAccessToken: () => get().accessToken,

  clearAuth: () => set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false }),
}));
