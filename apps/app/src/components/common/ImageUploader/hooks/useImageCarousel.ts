import { useCallback, useState, type Dispatch, type SetStateAction } from 'react';
import type { ImageUploadItem } from '../types';

interface UseImageCarouselOptions {
  images: ImageUploadItem[];
  onChange: (images: ImageUploadItem[]) => void;
}

interface UseImageCarouselReturn {
  currentImage: ImageUploadItem | undefined;
  currentIndex: number;
  deleteCurrentImage: () => void;
  goToNextImage: () => void;
  goToPreviousImage: () => void;
  selectImage: (index: number) => void;
  setCurrentImageIndex: Dispatch<SetStateAction<number>>;
}

export function useImageCarousel({ images, onChange }: UseImageCarouselOptions): UseImageCarouselReturn {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const currentImage = images[currentImageIndex] ?? images[0];
  const currentIndex = images[currentImageIndex] ? currentImageIndex : 0;

  const deleteCurrentImage = useCallback(() => {
    if (!currentImage) return;

    const nextImages = images.filter((image) => image.id !== currentImage.id);
    onChange(nextImages);

    if (currentIndex >= nextImages.length) {
      setCurrentImageIndex(Math.max(nextImages.length - 1, 0));
    }
  }, [currentImage, currentIndex, images, onChange]);

  const goToPreviousImage = useCallback(() => {
    if (images.length <= 1) return;

    setCurrentImageIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  }, [currentIndex, images.length]);

  const goToNextImage = useCallback(() => {
    if (images.length <= 1) return;

    setCurrentImageIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  }, [currentIndex, images.length]);

  const selectImage = useCallback((index: number) => {
    setCurrentImageIndex(index);
  }, []);

  return {
    currentImage,
    currentIndex,
    deleteCurrentImage,
    goToNextImage,
    goToPreviousImage,
    selectImage,
    setCurrentImageIndex,
  };
}
