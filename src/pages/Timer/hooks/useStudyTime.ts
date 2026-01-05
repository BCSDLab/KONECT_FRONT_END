import { useMutation, useQuery } from '@tanstack/react-query';
import { getStudyTimeSummary, StartStudyTimer, StopStudyTimer } from '@/apis/studyTime';
import type { TimerOffRequest } from '@/apis/studyTime/entity';

export const STUDY_TIME_SUMMARY_QUERY_KEY = ['studyTimeSummary'] as const;

export const useStudyTime = () => {
  const { data: studyTime } = useQuery({
    queryKey: STUDY_TIME_SUMMARY_QUERY_KEY,
    queryFn: getStudyTimeSummary,
  });

  const startMutation = useMutation({
    mutationKey: ['startStudyTimer'],
    mutationFn: StartStudyTimer,
  });

  const stopMutation = useMutation({
    mutationKey: ['stopStudyTimer'],
    mutationFn: (data: TimerOffRequest) => StopStudyTimer(data),
  });

  return {
    studyTime,
    startStudyTimer: startMutation.mutateAsync,
    stopStudyTimer: stopMutation.mutateAsync,
    isStarting: startMutation.isPending,
    isStopping: stopMutation.isPending,
  };
};
