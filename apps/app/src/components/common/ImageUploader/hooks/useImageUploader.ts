import { useCallback, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { uploadImage } from '@/apis/upload';
import type { UploadTarget } from '@/apis/upload/entity';
import type { ApiError } from '@/utils/ts/error/apiError';
import { createExistingImageUploadItem } from '../utils/imageUploadItem';
import { resolveImageUploadItemUrls } from '../utils/resolveImageUploadItems';
import type { ImageUploadItem } from '../types';

interface UseImageUploaderOptions {
  initialImageUrls?: string[];
  target: UploadTarget;
}

function createExistingImageUploadItems(imageUrls: string[]) {
  return imageUrls.map((imageUrl) => createExistingImageUploadItem(imageUrl));
}

export function useImageUploader({ initialImageUrls = [], target }: UseImageUploaderOptions) {
  const [images, setImages] = useState<ImageUploadItem[]>(() => createExistingImageUploadItems(initialImageUrls));
  const { mutateAsync, isPending, error } = useMutation({
    mutationKey: ['image-uploader', 'upload-items', target],
    mutationFn: (imagesToUpload: ImageUploadItem[]) =>
      resolveImageUploadItemUrls(imagesToUpload, (file) => uploadImage(file, target)),
  });

  const resetImages = useCallback((imageUrls: string[] = []) => {
    setImages(createExistingImageUploadItems(imageUrls));
  }, []);

  const selectedImage = images[0];
  const selectedImageUrl = selectedImage?.previewUrl ?? '';

  const uploadImages = useCallback(
    (imagesToUpload: ImageUploadItem[] = images) => mutateAsync(imagesToUpload),
    [images, mutateAsync]
  );

  return {
    images,
    isUploadingImages: isPending,
    resetImages,
    selectedImage,
    selectedImageUrl,
    setImages,
    uploadError: error as ApiError | null,
    uploadImages,
  };
}
