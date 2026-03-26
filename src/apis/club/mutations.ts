import { mutationOptions } from '@tanstack/react-query';
import type { ClubApplyRequest } from './entity';
import { applyClub } from '.';

export const clubMutationKeys = {
  apply: (clubId: number) => ['clubs', 'apply', clubId] as const,
};

export const clubMutations = {
  apply: (clubId: number) =>
    mutationOptions({
      mutationKey: clubMutationKeys.apply(clubId),
      mutationFn: (body: ClubApplyRequest) => applyClub(clubId, body),
    }),
};
