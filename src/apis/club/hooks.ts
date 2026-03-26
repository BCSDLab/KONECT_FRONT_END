import { useMutation, useQueryClient } from '@tanstack/react-query';
import { clubMutations } from './mutations';
import { clubQueryKeys } from './queries';

export const useApplyClubMutation = (clubId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...clubMutations.apply(clubId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: clubQueryKeys.detail(clubId) });
    },
  });
};
