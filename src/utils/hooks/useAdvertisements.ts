import { useMutation, useQueries } from '@tanstack/react-query';
import { getAdvertisements, postAdvertisementClick } from '@/apis/advertisement';
import type { Advertisement } from '@/apis/advertisement/entity';
import { advertisementQueryKeys } from '@/apis/advertisement/queries';

const ADVERTISEMENT_BATCH_SIZE = 2;

interface UseAdvertisementsParams {
  advertisementCount: number;
  scope: string;
}

export const useAdvertisements = ({ advertisementCount, scope }: UseAdvertisementsParams) => {
  const batchCount = Math.ceil(advertisementCount / ADVERTISEMENT_BATCH_SIZE);

  const advertisementQueries = useQueries({
    queries: Array.from({ length: batchCount }, (_, batchIndex) => ({
      queryKey: advertisementQueryKeys.randomBatch(scope, batchIndex),
      queryFn: () => getAdvertisements({ count: ADVERTISEMENT_BATCH_SIZE }),
      staleTime: Infinity,
    })),
  });

  const { mutate: trackAdvertisementClick } = useMutation({
    mutationFn: (advertisementId: number) => postAdvertisementClick(advertisementId),
    retry: false,
  });

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
