import { useQuery } from '@tanstack/react-query';
import { useStartStudyTimerMutation, useStopStudyTimerMutation } from '@/apis/studyTime/hooks';
import { studyTimeQueries } from '@/apis/studyTime/queries';

export const useStudyTime = () => {
  const { data: studyTime } = useQuery(studyTimeQueries.summary());
  const startMutation = useStartStudyTimerMutation();
  const stopMutation = useStopStudyTimerMutation();

  return {
    studyTime,
    startStudyTimer: startMutation.mutateAsync,
    stopStudyTimer: stopMutation.mutateAsync,
    isStarting: startMutation.isPending,
    isStopping: stopMutation.isPending,
  };
};
