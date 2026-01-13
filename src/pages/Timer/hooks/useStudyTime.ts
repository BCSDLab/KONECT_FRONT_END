import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getStudyTimeSummary, startStudyTimer, stopStudyTimer } from '@/apis/studyTime';
import { API_ERROR_CODES, isApiError } from '@/interface/error';

export const STUDY_TIME_SUMMARY_QUERY_KEY = ['studyTimeSummary'] as const;

export const useStudyTime = () => {
  const queryClient = useQueryClient();

  const { data: studyTime } = useQuery({
    queryKey: STUDY_TIME_SUMMARY_QUERY_KEY,
    queryFn: getStudyTimeSummary,
  });

  const stopMutation = useMutation({
    mutationKey: ['stopStudyTimer'],
    mutationFn: stopStudyTimer,
  });

  const startMutation = useMutation({
    mutationKey: ['startStudyTimer'],
    mutationFn: startStudyTimer,
    onError: async (error) => {
      if (!isApiError(error)) throw error;

      // 이미 실행 중인 타이머가 있으면 정리 후 재시도
      if (error.apiError?.code === API_ERROR_CODES.ALREADY_RUNNING_STUDY_TIMER) {
        await stopMutation.mutateAsync({ totalSeconds: 0 });
        queryClient.invalidateQueries({ queryKey: STUDY_TIME_SUMMARY_QUERY_KEY });
      }

      throw error;
    },
  });

  return {
    studyTime,
    startStudyTimer: startMutation.mutateAsync,
    stopStudyTimer: stopMutation.mutateAsync,
    isStarting: startMutation.isPending,
    isStopping: stopMutation.isPending,
  };
};
