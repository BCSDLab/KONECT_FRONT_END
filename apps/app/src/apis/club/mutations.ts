import { mutationOptions } from '@tanstack/react-query';
import { applyClub } from '@/apis/club';
import type { ClubApplyRequest } from '@/apis/club/entity';

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
