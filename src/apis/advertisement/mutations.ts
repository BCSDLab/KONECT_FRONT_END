import { mutationOptions } from '@tanstack/react-query';
import { postAdvertisementClick } from '.';

export const advertisementMutationKeys = {
  click: () => ['advertisements', 'click'] as const,
};

export const advertisementMutations = {
  click: () =>
    mutationOptions({
      mutationKey: advertisementMutationKeys.click(),
      mutationFn: postAdvertisementClick,
      retry: false,
    }),
};
