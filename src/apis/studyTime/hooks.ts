import { useMutation, useQueryClient } from '@tanstack/react-query';
import { studyTimeMutations } from '@/apis/studyTime/mutations';
import { studyTimeQueryKeys } from '@/apis/studyTime/queries';
import { API_ERROR_CODES, isApiError } from '@/utils/ts/error/apiError';

export const useStopStudyTimerMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    ...studyTimeMutations.stopTimer(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: studyTimeQueryKeys.summary() });
    },
  });
};

export const useStartStudyTimerMutation = () => {
  const stopMutation = useStopStudyTimerMutation();

  return useMutation({
    ...studyTimeMutations.startTimer(),
    onError: async (error) => {
      if (!isApiError(error)) throw error;

      // 이미 실행 중인 타이머가 있으면 정리 후 재시도
      if (error.apiError?.code === API_ERROR_CODES.ALREADY_RUNNING_STUDY_TIMER) {
        await stopMutation.mutateAsync({ totalSeconds: 0 });
      }

      throw error;
    },
  });
};
