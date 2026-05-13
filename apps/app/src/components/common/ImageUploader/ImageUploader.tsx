import AddPhotoAlternateIcon from '@/assets/svg/add-photo-alternate.svg';
import ChevronLeft from '@/assets/svg/chevron-left.svg';
import ChevronRight from '@/assets/svg/chevron-right.svg';
import { cn } from '@/utils/ts/cn';
import { useImageCarousel } from './hooks/useImageCarousel';
import { useImagePreparation } from './hooks/useImagePreparation';
import { type ImageUploaderLayout, type ImageUploaderSelectionMode, type ImageUploadItem } from './types';

interface ImageUploaderProps {
  className?: string;
  disabled?: boolean;
  layout: ImageUploaderLayout;
  onChange: (images: ImageUploadItem[]) => void;
  onPreparingChange?: (isPreparing: boolean) => void;
  onPreviewClick?: (image: ImageUploadItem, index: number) => void;
  previewAlt?: (index: number) => string;
  selectionMode: ImageUploaderSelectionMode;
  value: ImageUploadItem[];
}

interface ImageUploaderEmptyButtonProps {
  className: string;
  disabled: boolean;
  isPreparing: boolean;
  onClick: () => void;
}

function ImageUploaderEmptyButton({ className, disabled, isPreparing, onClick }: ImageUploaderEmptyButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'border-text-200 text-text-500 flex flex-col items-center justify-center gap-2 border-[0.7px] bg-white disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
    >
      <AddPhotoAlternateIcon aria-hidden="true" className="size-15" />
      <p className="text-center leading-[1.6] font-semibold whitespace-pre-line">
        {isPreparing ? '이미지를 준비하고 있어요' : '이미지를 추가해주세요'}
      </p>
    </button>
  );
}

interface ImageUploaderActionButtonProps {
  action: 'change' | 'delete';
  disabled: boolean;
  onClick: () => void;
}

function ImageUploaderActionButton({ action, disabled, onClick }: ImageUploaderActionButtonProps) {
  const isDeleteAction = action === 'delete';

  return (
    <button
      type="button"
      aria-label={isDeleteAction ? '이미지 삭제' : '이미지 변경'}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'absolute right-3 flex size-6 items-center justify-center rounded-full bg-[#9f9f9f] text-[18px] leading-none text-white',
        isDeleteAction ? 'top-3' : 'bottom-3',
        'disabled:cursor-not-allowed disabled:opacity-50'
      )}
    >
      <span>{isDeleteAction ? '×' : '+'}</span>
    </button>
  );
}

function ImageUploader({
  className,
  disabled = false,
  layout,
  onChange,
  onPreparingChange,
  onPreviewClick,
  previewAlt = (index) => `업로드 이미지 ${index + 1}`,
  selectionMode,
  value,
}: ImageUploaderProps) {
  const {
    currentImage,
    currentIndex,
    deleteCurrentImage,
    goToNextImage,
    goToPreviousImage,
    selectImage,
    setCurrentImageIndex,
  } = useImageCarousel({
    images: value,
    onChange,
  });
  const { fileInputRef, handleImageSelect, isDisabled, isPreparing, openFilePicker } = useImagePreparation({
    disabled,
    images: value,
    onChange,
    onPreparingChange,
    selectionMode,
    setCurrentImageIndex,
  });

  const isSquareLayout = layout === 'square';

  const renderEmptyState = () => (
    <ImageUploaderEmptyButton
      onClick={openFilePicker}
      disabled={isDisabled}
      isPreparing={isPreparing}
      className={isSquareLayout ? 'size-full rounded-sm' : 'h-56.5 w-full rounded-[20px]'}
    />
  );

  const renderPreviewImage = (image: ImageUploadItem, index: number) => {
    const imageNode = (
      <img
        src={image.previewUrl}
        alt={previewAlt(index)}
        className={isSquareLayout ? 'max-h-full w-full object-contain' : 'h-full w-full object-cover'}
      />
    );

    if (!onPreviewClick) return imageNode;

    return (
      <button type="button" onClick={() => onPreviewClick(image, index)} className="h-full w-full">
        {imageNode}
      </button>
    );
  };

  const renderSquarePreview = () => {
    if (!currentImage) return renderEmptyState();

    return (
      <>
        <div className="flex h-full items-center justify-center overflow-hidden rounded-sm bg-white p-4">
          {renderPreviewImage(currentImage, currentIndex)}
        </div>
        <ImageUploaderActionButton action="delete" onClick={deleteCurrentImage} disabled={isDisabled} />
        <ImageUploaderActionButton action="change" onClick={openFilePicker} disabled={isDisabled} />
      </>
    );
  };

  const renderWidePreview = () => {
    if (!currentImage) return renderEmptyState();

    return (
      <div className="flex flex-col gap-3">
        <div className="border-text-200 relative h-56.5 overflow-hidden rounded-[20px] border-[0.7px] bg-white">
          {renderPreviewImage(currentImage, currentIndex)}
          <ImageUploaderActionButton action="delete" onClick={deleteCurrentImage} disabled={isDisabled} />

          {value.length > 1 && (
            <>
              <button
                type="button"
                onClick={goToPreviousImage}
                disabled={isDisabled}
                aria-label="이전 이미지"
                className="absolute top-1/2 left-3 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-[0_0_3px_rgba(0,0,0,0.15)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeft aria-hidden="true" className="h-4 w-4 text-indigo-700" />
              </button>
              <button
                type="button"
                onClick={goToNextImage}
                disabled={isDisabled}
                aria-label="다음 이미지"
                className="absolute top-1/2 right-3 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-[0_0_3px_rgba(0,0,0,0.15)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronRight aria-hidden="true" className="h-4 w-4 text-indigo-700" />
              </button>
            </>
          )}
        </div>

        {selectionMode === 'multiple' && (
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              {value.map((image, index) => (
                <button
                  key={image.id}
                  type="button"
                  onClick={() => selectImage(index)}
                  aria-label={`${index + 1}번 이미지 보기`}
                  className={cn(
                    'h-2 w-2 rounded-full transition-colors',
                    index === currentIndex ? 'bg-primary-500' : 'bg-text-200'
                  )}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={openFilePicker}
              disabled={isDisabled}
              className="bg-primary-500 rounded-full px-4 py-2 text-[13px] leading-[1.6] font-semibold text-white"
            >
              이미지 추가
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderContent = () => {
    if (layout === 'square') return renderSquarePreview();
    return renderWidePreview();
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={selectionMode === 'multiple'}
        onChange={handleImageSelect}
        disabled={isDisabled}
        className="hidden"
      />
      {renderContent()}
    </div>
  );
}

export default ImageUploader;
