import {
  startTransition,
  type ChangeEvent,
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useToastContext } from '@/contexts/useToastContext';
import { prepareImageFile } from '@/utils/ts/image/imagePreprocessor';
import { mapWithConcurrencyLimit } from '@/utils/ts/promise';
import { createLocalImageUploadItem, revokeImagePreviewUrl } from '../utils/imageUploadItem';
import type { ImageUploaderSelectionMode, ImageUploadItem } from '../types';

const IMAGE_PREPARATION_CONCURRENCY = 2;

interface UseImagePreparationOptions {
  disabled: boolean;
  images: ImageUploadItem[];
  onChange: (images: ImageUploadItem[]) => void;
  onPreparingChange?: (isPreparing: boolean) => void;
  selectionMode: ImageUploaderSelectionMode;
  setCurrentImageIndex: Dispatch<SetStateAction<number>>;
}

export function useImagePreparation({
  disabled,
  images,
  onChange,
  onPreparingChange,
  selectionMode,
  setCurrentImageIndex,
}: UseImagePreparationOptions) {
  const { showToast } = useToastContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previousImagesRef = useRef<ImageUploadItem[]>(images);
  const isMountedRef = useRef(true);
  const [isPreparing, setIsPreparing] = useState(false);
  const isDisabled = disabled || isPreparing;

  useEffect(() => {
    const removedImages = previousImagesRef.current.filter(
      (previousImage) => !images.some((nextImage) => nextImage.id === previousImage.id)
    );

    removedImages.forEach(revokeImagePreviewUrl);
    previousImagesRef.current = images;
  }, [images]);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      previousImagesRef.current.forEach(revokeImagePreviewUrl);
    };
  }, []);

  const updatePreparing = useCallback(
    (nextIsPreparing: boolean) => {
      if (!isMountedRef.current) return;

      setIsPreparing(nextIsPreparing);
      onPreparingChange?.(nextIsPreparing);
    },
    [onPreparingChange]
  );

  const handleImageSelect = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files || files.length === 0 || isDisabled) return;

      const selectedFiles = Array.from(files);
      const previousImageCount = images.length;
      const preparedItems: Array<ImageUploadItem | null> = new Array(selectedFiles.length).fill(null);
      const createdItems: ImageUploadItem[] = [];
      const committedImageIds = new Set<string>();
      let visiblePreparedCount = 0;

      updatePreparing(true);

      mapWithConcurrencyLimit(
        selectedFiles,
        IMAGE_PREPARATION_CONCURRENCY,
        async (file) => createLocalImageUploadItem(await prepareImageFile(file)),
        (preparedItem, index) => {
          createdItems.push(preparedItem);

          if (!isMountedRef.current) return;

          if (selectionMode === 'single') {
            startTransition(() => {
              committedImageIds.add(preparedItem.id);
              onChange([preparedItem]);
              setCurrentImageIndex(0);
            });
            return;
          }

          preparedItems[index] = preparedItem;

          let nextVisiblePreparedCount = visiblePreparedCount;

          while (nextVisiblePreparedCount < preparedItems.length && preparedItems[nextVisiblePreparedCount]) {
            nextVisiblePreparedCount += 1;
          }

          if (nextVisiblePreparedCount === visiblePreparedCount) return;

          const shouldFocusFirstPreparedImage = visiblePreparedCount === 0 && nextVisiblePreparedCount > 0;
          visiblePreparedCount = nextVisiblePreparedCount;

          const orderedPreparedItems = preparedItems
            .slice(0, visiblePreparedCount)
            .filter(Boolean) as ImageUploadItem[];

          startTransition(() => {
            orderedPreparedItems.forEach((item) => committedImageIds.add(item.id));
            onChange([...images.slice(0, previousImageCount), ...orderedPreparedItems]);

            if (shouldFocusFirstPreparedImage) {
              setCurrentImageIndex(previousImageCount);
            }
          });
        }
      )
        .catch(() => {
          showToast('이미지 처리에 실패했습니다. 다시 시도해주세요.', 'error');
        })
        .finally(() => {
          if (!isMountedRef.current) {
            createdItems.forEach(revokeImagePreviewUrl);
            return;
          }

          createdItems.filter((item) => !committedImageIds.has(item.id)).forEach(revokeImagePreviewUrl);

          updatePreparing(false);
          e.target.value = '';
        });
    },
    [images, isDisabled, onChange, selectionMode, setCurrentImageIndex, showToast, updatePreparing]
  );

  const openFilePicker = useCallback(() => {
    if (isDisabled) return;

    fileInputRef.current?.click();
  }, [isDisabled]);

  return {
    fileInputRef,
    handleImageSelect,
    isDisabled,
    isPreparing,
    openFilePicker,
  };
}
