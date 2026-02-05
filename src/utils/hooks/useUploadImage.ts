import { useMutation } from '@tanstack/react-query';
import { uploadImage } from '@/apis/upload';
import type { ApiError } from '@/interface/error';

const useUploadImage = () => {
  const mutation = useMutation({
    mutationFn: uploadImage,
  });

  return {
    ...mutation,
    error: mutation.error as ApiError | null,
  };
};

export default useUploadImage;
