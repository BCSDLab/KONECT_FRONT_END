import { create } from 'zustand';
import { getMyInfo } from '@/apis/auth';
import type { MyInfoResponse } from '@/apis/auth/entity';

interface AuthState {
  user: MyInfoResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  initialize: () => Promise<void>;
  setUser: (user: MyInfoResponse | null) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  initialize: async () => {
    if (get().user) {
      set({ isLoading: false });
      return;
    }

    try {
      const user = await getMyInfo();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),

  clearAuth: () => set({ user: null, isAuthenticated: false, isLoading: false }),
}));
