import { create } from 'zustand';

interface SignupState {
  isMarketingAgreement: boolean;
  isTermsAgreement: boolean;
  isPrivacyAgreement: boolean;
  universityId: string;
  universityName: string;
  studentId: string;
  name: string;
  update: (partial: Partial<SignupState>) => void;
  reset: () => void;
}

const initialState = {
  isMarketingAgreement: false,
  isTermsAgreement: false,
  isPrivacyAgreement: false,
  universityId: '',
  universityName: '',
  studentId: '',
  name: '',
};

export const useSignupStore = create<SignupState>((set) => ({
  ...initialState,
  update: (partial) => set(partial),
  reset: () => set(initialState),
}));
