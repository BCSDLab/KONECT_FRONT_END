import { create } from 'zustand';

interface SignupState {
  marketing: boolean;
  school: string;
  studentId: string;
  name: string;
  update: (partial: Partial<SignupState>) => void;
  reset: () => void;
}

const initialState = {
  marketing: false,
  school: '',
  studentId: '',
  name: '',
};

export const useSignupStore = create<SignupState>((set) => ({
  ...initialState,
  update: (partial) => set(partial),
  reset: () => set(initialState),
}));
