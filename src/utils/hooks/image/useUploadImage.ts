import { useMutation } from '@tanstack/react-query';
import type { UploadTarget } from '@/apis/upload/entity';
import { uploadMutations } from '@/apis/upload/mutations';
import type { ApiError } from '@/utils/ts/error/apiError';

const useUploadImage = (target: UploadTarget) => {
  const mutation = useMutation(uploadMutations.image(target));

  return {
    ...mutation,
    error: mutation.error as ApiError | null,
  };
};

export default useUploadImage;
