import { useMutation } from '@tanstack/react-query';
import { uploadImage } from '@/apis/upload';
import type { UploadTarget } from '@/apis/upload/entity';
import type { ApiError } from '@/interface/error';

const useUploadImage = (target: UploadTarget) => {
  const mutation = useMutation({
    mutationFn: (file: File) => uploadImage(file, target),
  });

  return {
    ...mutation,
    error: mutation.error as ApiError | null,
  };
};

export default useUploadImage;
