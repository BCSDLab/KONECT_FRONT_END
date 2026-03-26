import { useMutation, useQueries } from '@tanstack/react-query';
import type { Advertisement } from '@/apis/advertisement/entity';
import { advertisementMutations } from '@/apis/advertisement/mutations';
import { advertisementQueries as advertisementQueryFactories } from '@/apis/advertisement/queries';

const ADVERTISEMENT_BATCH_SIZE = 2;

interface UseAdvertisementsParams {
  advertisementCount: number;
  scope: string;
}

export const useAdvertisements = ({ advertisementCount, scope }: UseAdvertisementsParams) => {
  const batchCount = Math.ceil(advertisementCount / ADVERTISEMENT_BATCH_SIZE);

  const advertisementQueries = useQueries({
    queries: Array.from({ length: batchCount }, (_, batchIndex) =>
      advertisementQueryFactories.randomBatch(scope, batchIndex)
    ),
  });

  const { mutate: trackAdvertisementClick } = useMutation(advertisementMutations.click());

  const advertisements: Advertisement[] = advertisementQueries
    .flatMap((query) => query.data?.advertisements ?? [])
    .slice(0, advertisementCount);
  const isLoadingAdvertisements = advertisementQueries.some((query) => query.isPending);

  return {
    advertisements,
    isLoadingAdvertisements,
    trackAdvertisementClick,
  };
};
