export const advertisementQueryKeys = {
  all: ['advertisements'] as const,
  randomBatch: (scope: string, batchIndex: number) =>
    [...advertisementQueryKeys.all, scope, 'random-batch', batchIndex] as const,
};
