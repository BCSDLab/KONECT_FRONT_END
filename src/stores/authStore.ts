import { create } from 'zustand';
import { getMyInfo, refreshAccessToken } from '@/apis/auth';
import type { MyInfoResponse } from '@/apis/auth/entity';
import { registerPushToken } from '@/apis/notification';
import { getCookie } from '@/utils/ts/cookie';

const PUSH_TOKEN_STORAGE_KEY = 'REGISTERED_PUSH_TOKEN';

async function registerPushTokenIfNeeded() {
  const token = getCookie('EXPO_PUSH_TOKEN');
  if (!token) return;

  const lastRegisteredToken = localStorage.getItem(PUSH_TOKEN_STORAGE_KEY);
  if (lastRegisteredToken === token) return;

  try {
    await registerPushToken(token);
    localStorage.setItem(PUSH_TOKEN_STORAGE_KEY, token);
  } catch (error) {
    console.error('푸시 토큰 등록 실패:', error);
  }
}

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
      // 1. 토큰 갱신 (필수 - 이후 API 호출에 필요)
      const accessToken = await refreshAccessToken();
      set({ accessToken });

      // 2. 사용자 정보와 푸시 토큰 등록을 병렬로 실행
      const [user] = await Promise.all([getMyInfo(), registerPushTokenIfNeeded()]);

      set({ user, isAuthenticated: true, isLoading: false });
    } catch {
      set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
    }
  },

  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),

  setAccessToken: (token) => set({ accessToken: token }),

  getAccessToken: () => get().accessToken,

  clearAuth: () => set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false }),
}));

window.addEventListener('message', (event: MessageEvent) => {
  try {
    const data = JSON.parse(event.data);
    if (data.type !== 'PUSH_TOKEN' || !data.token) return;

    const lastToken = localStorage.getItem(PUSH_TOKEN_STORAGE_KEY);
    if (lastToken === data.token) return;

    const { accessToken } = useAuthStore.getState();
    if (!accessToken) return;

    registerPushToken(data.token)
      .then(() => localStorage.setItem(PUSH_TOKEN_STORAGE_KEY, data.token))
      .catch((error) => console.error('푸시 토큰 등록 실패:', error));
  } catch {
    // JSON 파싱 실패 등 무시
  }
});
