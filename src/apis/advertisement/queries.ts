import { queryOptions } from '@tanstack/react-query';
import { getAdvertisements } from '.';

export const advertisementQueryKeys = {
  all: ['advertisements'] as const,
  randomBatch: (scope: string, batchIndex: number) =>
    [...advertisementQueryKeys.all, scope, 'random-batch', batchIndex] as const,
};

export const advertisementQueries = {
  randomBatch: (scope: string, batchIndex: number) =>
    queryOptions({
      queryKey: advertisementQueryKeys.randomBatch(scope, batchIndex),
      queryFn: () => getAdvertisements({ count: 2 }),
      staleTime: Infinity,
    }),
};
