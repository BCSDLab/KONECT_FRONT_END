import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authMutations } from './mutations';
import { authQueryKeys } from './queries';

export const useUpdateMyInfoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    ...authMutations.updateMyInfo(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: authQueryKeys.myInfo() });
    },
  });
};
