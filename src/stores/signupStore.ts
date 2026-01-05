import { create } from 'zustand';

interface SignupState {
  isMarketingAgreement: boolean;
  isTermsAgreement: boolean;
  isPrivacyAgreement: boolean;
  universityId: string;
  studentId: number;
  name: string;
  update: (partial: Partial<SignupState>) => void;
  reset: () => void;
}

const initialState = {
  isMarketingAgreement: false,
  isTermsAgreement: false,
  isPrivacyAgreement: false,
  universityId: '',
  studentId: 0,
  name: '',
};

export const useSignupStore = create<SignupState>((set) => ({
  ...initialState,
  update: (partial) => set(partial),
  reset: () => set(initialState),
}));
