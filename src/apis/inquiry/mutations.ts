import { mutationOptions } from '@tanstack/react-query';
import { postInquiry } from '.';

export const inquiryMutationKeys = {
  create: () => ['inquiry', 'create'] as const,
};

export const inquiryMutations = {
  create: () =>
    mutationOptions({
      mutationKey: inquiryMutationKeys.create(),
      mutationFn: postInquiry,
    }),
};
