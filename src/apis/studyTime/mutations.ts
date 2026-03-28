import { mutationOptions } from '@tanstack/react-query';
import { startStudyTimer, stopStudyTimer } from '@/apis/studyTime';
import type { StopTimerRequest } from '@/apis/studyTime/entity';

export const studyTimeMutationKeys = {
  startTimer: () => ['studyTime', 'startTimer'] as const,
  stopTimer: () => ['studyTime', 'stopTimer'] as const,
};

export const studyTimeMutations = {
  startTimer: () =>
    mutationOptions({
      mutationKey: studyTimeMutationKeys.startTimer(),
      mutationFn: startStudyTimer,
    }),
  stopTimer: () =>
    mutationOptions({
      mutationKey: studyTimeMutationKeys.stopTimer(),
      mutationFn: (data: StopTimerRequest) => stopStudyTimer(data),
    }),
};
