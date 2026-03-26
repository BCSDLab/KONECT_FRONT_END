import { mutationOptions } from '@tanstack/react-query';
import type { StopTimerRequest } from './entity';
import { startStudyTimer, stopStudyTimer } from '.';

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
