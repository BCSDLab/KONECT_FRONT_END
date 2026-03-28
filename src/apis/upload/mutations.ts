import { mutationOptions } from '@tanstack/react-query';
import type { UploadTarget } from './entity';
import { uploadImage } from '.';

export const uploadMutationKeys = {
  image: (target: UploadTarget) => ['upload', 'image', target] as const,
};

export const uploadMutations = {
  image: (target: UploadTarget) =>
    mutationOptions({
      mutationKey: uploadMutationKeys.image(target),
      mutationFn: (file: File) => uploadImage(file, target),
    }),
};
