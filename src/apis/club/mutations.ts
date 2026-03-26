import { mutationOptions, type QueryClient } from '@tanstack/react-query';
import { clubQueryKeys } from './queries';
import type { ClubApplyRequest } from './entity';
import { applyClub } from '.';

export const clubMutationKeys = {
  apply: (clubId: number) => ['clubs', 'apply', clubId] as const,
};

export const clubMutations = {
  apply: (queryClient: QueryClient, clubId: number) =>
    mutationOptions({
      mutationKey: clubMutationKeys.apply(clubId),
      mutationFn: (body: ClubApplyRequest) => applyClub(clubId, body),
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: clubQueryKeys.detail(clubId) });
      },
    }),
};
