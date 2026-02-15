import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Answer {
  questionId: number;
  answer: string;
}

interface ClubApplicationState {
  answers: Answer[];
  clubId: number | null;
  setApplication: (clubId: number, answers: Answer[]) => void;
  clearApplication: () => void;
}

const initialState = {
  answers: [],
  clubId: null,
};

export const useClubApplicationStore = create<ClubApplicationState>()(
  persist(
    (set) => ({
      ...initialState,
      setApplication: (clubId, answers) => set({ clubId, answers }),
      clearApplication: () => set(initialState),
    }),
    { name: 'club-application' }
  )
);
