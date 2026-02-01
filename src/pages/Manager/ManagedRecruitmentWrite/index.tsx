import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import ChevronLeft from '@/assets/svg/chevron-left.svg';
import ChevronRight from '@/assets/svg/chevron-right.svg';
import ImageIcon from '@/assets/svg/image.svg';
import BottomModal from '@/components/common/BottomModal';
import DatePicker from '@/pages/Manager/components/DatePicker';
import { useManagedClubRecruitment, useManagedClubRecruitmentQuery } from '@/pages/Manager/hooks/useManagerQuery';
import useBooleanState from '@/utils/hooks/useBooleanState';
import useUploadImage from '@/utils/hooks/useUploadImage';

interface ImageItem {
  file?: File; // 새 이미지일 경우에만 존재
  previewUrl: string; // 미리보기 URL (blob: 또는 기존 URL)
  isExisting?: boolean; // 기존 이미지 여부
}

const dateButtonStyle = twMerge(
  'rounded-lg bg-white px-4 py-2 text-indigo-700 transition-colors active:bg-indigo-25 shadow-[0_2px_4px_rgba(0,0,0,0.1)] text-h1 font-bold'
);

function formatDateDot(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

function parseDateDot(dateStr: string): Date {
  const [year, month, day] = dateStr.split('.').map(Number);
  return new Date(year, month - 1, day);
}

function ManagedRecruitmentWrite() {
  const { clubId } = useParams<{ clubId: string }>();
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [content, setContent] = useState('');
  const [isAlwaysRecruiting, setIsAlwaysRecruiting] = useState(false);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [hasHandledExisting, setHasHandledExisting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: uploadImage, error: uploadError } = useUploadImage();
  const { data: existingRecruitment } = useManagedClubRecruitmentQuery(Number(clubId));
  const { mutate: saveRecruitment, isPending, error } = useManagedClubRecruitment(Number(clubId));
  const { value: isChoiceModalOpen, setTrue: openChoiceModal, setFalse: closeChoiceModal } = useBooleanState(false);

  useEffect(() => {
    if (existingRecruitment && !hasHandledExisting) {
      openChoiceModal();
    }
  }, [existingRecruitment, hasHandledExisting, openChoiceModal]);

  const applyExistingRecruitment = () => {
    if (!existingRecruitment) return;

    setContent(existingRecruitment.content);
    if (existingRecruitment.startDate && existingRecruitment.endDate) {
      setStartDate(parseDateDot(existingRecruitment.startDate));
      setEndDate(parseDateDot(existingRecruitment.endDate));
    }
    const isAlways = !existingRecruitment.startDate || !existingRecruitment.endDate;
    setIsAlwaysRecruiting(isAlways);
    if (existingRecruitment.images && existingRecruitment.images.length > 0) {
      setImages(
        existingRecruitment.images.map((img) => ({
          previewUrl: img.url,
          isExisting: true,
        }))
      );
    }
    setHasHandledExisting(true);
    closeChoiceModal();
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isStartAfterEnd = startDate > endDate;
  const isEndBeforeToday = endDate < today;
  const hasDateError = !isAlwaysRecruiting && (isStartAfterEnd || isEndBeforeToday);

  const getDateErrorMessage = () => {
    if (isAlwaysRecruiting) return null;
    if (isStartAfterEnd) return '시작일은 종료일보다 앞서야 합니다.';
    if (isEndBeforeToday) return '종료일은 오늘 이후여야 합니다.';
    return null;
  };

  const handleReset = () => {
    setStartDate(new Date());
    setEndDate(new Date());
    setContent('');
    setIsAlwaysRecruiting(false);
    images.forEach((img) => {
      if (!img.isExisting) URL.revokeObjectURL(img.previewUrl);
    });
    setImages([]);
    setCurrentImageIndex(0);
    setHasHandledExisting(true);
    closeChoiceModal();
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newItems = Array.from(files).map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setImages((prev) => {
      const newImages = [...prev, ...newItems];
      setCurrentImageIndex(newImages.length - 1);
      return newImages;
    });
    e.target.value = '';
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleDeleteImage = () => {
    URL.revokeObjectURL(images[currentImageIndex].previewUrl);
    const newImages = images.filter((_, index) => index !== currentImageIndex);
    setImages(newImages);
    if (currentImageIndex >= newImages.length && newImages.length > 0) {
      setCurrentImageIndex(newImages.length - 1);
    } else if (newImages.length === 0) {
      setCurrentImageIndex(0);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsUploading(true);
    try {
      // 새 이미지만 업로드 (file이 있는 것만)
      const newImages = images.filter((img) => img.file);
      const existingImages = images.filter((img) => img.isExisting);

      const uploadResults = await Promise.all(newImages.map((img) => uploadImage(img.file!)));
      const uploadedImageData = uploadResults.map((res) => ({ url: res.fileUrl }));
      const existingImageData = existingImages.map((img) => ({ url: img.previewUrl }));
      const imageData = [...existingImageData, ...uploadedImageData];

      const onSuccess = () => navigate(`/manager/${clubId}/recruitment`);

      if (isAlwaysRecruiting) {
        saveRecruitment({ content, images: imageData, isAlwaysRecruiting: true }, { onSuccess });
      } else {
        saveRecruitment(
          {
            content,
            images: imageData,
            isAlwaysRecruiting: false,
            startDate: formatDateDot(startDate),
            endDate: formatDateDot(endDate),
          },
          { onSuccess }
        );
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <form id="recruitment-form" onSubmit={handleSubmit} className="flex flex-1 flex-col gap-6 overflow-auto p-3">
        <section className="flex w-full flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <span className="text-h4">모집 일시</span>
            <div className="flex items-center gap-2">
              <label htmlFor="alwaysRecruit" className="text-h4 cursor-pointer select-none">
                상시 모집
              </label>
              <input
                id="alwaysRecruit"
                type="checkbox"
                checked={isAlwaysRecruiting}
                onChange={(e) => setIsAlwaysRecruiting(e.target.checked)}
                className="h-4 w-4"
              />
            </div>
          </div>
          {!isAlwaysRecruiting && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-3">
                <DatePicker
                  selectedDate={startDate}
                  onChange={setStartDate}
                  renderTrigger={(toggle) => (
                    <button type="button" onClick={toggle} className={dateButtonStyle}>
                      {formatDateDot(startDate)}
                    </button>
                  )}
                />
                <span className="text-indigo-400">~</span>
                <DatePicker
                  selectedDate={endDate}
                  onChange={setEndDate}
                  renderTrigger={(toggle) => (
                    <button type="button" onClick={toggle} className={dateButtonStyle}>
                      {formatDateDot(endDate)}
                    </button>
                  )}
                />
              </div>
              {hasDateError && <p className="text-sm text-red-500">{getDateErrorMessage()}</p>}
            </div>
          )}
        </section>
        <section className="flex w-full flex-col gap-4">
          <span className="text-h4">
            모집 공고 <span className="text-[#EA4335]">*</span>
          </span>
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleContentChange}
            rows={4}
            className="text-h5 mt-2 w-full resize-none overflow-hidden rounded-lg bg-white p-3 shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
            placeholder="모집 공고 내용을 작성해주세요."
          />
        </section>
        <section className="flex w-full flex-col gap-4">
          <span className="text-h4">이미지 등록</span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
            className="hidden"
          />
          <div className="flex justify-center">
            {images.length === 0 ? (
              <button
                type="button"
                onClick={handleImageClick}
                className="border-indigo-75 hover:bg-indigo-25 flex h-40 w-40 flex-col items-center justify-center gap-2.5 rounded-xl border transition-colors"
              >
                <ImageIcon />
                <p className="text-sub4 text-center whitespace-pre-line text-indigo-100">
                  이미지를 {'\n'} 추가해주세요
                </p>
              </button>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="relative flex items-center gap-2">
                  {images.length > 1 && (
                    <button
                      type="button"
                      onClick={handlePrevImage}
                      className="hover:bg-indigo-25 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5 text-indigo-700" />
                    </button>
                  )}
                  <div className="relative h-40 w-40 overflow-hidden rounded-xl">
                    <img
                      src={images[currentImageIndex].previewUrl}
                      alt={`업로드 이미지 ${currentImageIndex + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleDeleteImage}
                      className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
                    >
                      ✕
                    </button>
                  </div>
                  {images.length > 1 && (
                    <button
                      type="button"
                      onClick={handleNextImage}
                      className="hover:bg-indigo-25 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md transition-colors"
                    >
                      <ChevronRight className="h-5 w-5 text-indigo-700" />
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {images.length > 1 && (
                    <div className="flex gap-1">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => setCurrentImageIndex(index)}
                          className={twMerge(
                            'h-2 w-2 rounded-full transition-colors',
                            index === currentImageIndex ? 'bg-indigo-700' : 'bg-indigo-200'
                          )}
                        />
                      ))}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleImageClick}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-700 text-white transition-colors hover:bg-indigo-800"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </form>
      <div className="flex flex-col gap-2 p-3" style={{ marginBottom: 'calc(20px + var(--sab))' }}>
        {uploadError && (
          <p className="text-sm text-red-500">{uploadError.message ?? '이미지 업로드에 실패했습니다.'}</p>
        )}
        {error && <p className="text-sm text-red-500">{error.message ?? '모집 공고 수정에 실패했습니다.'}</p>}
        <button
          type="submit"
          form="recruitment-form"
          disabled={isPending || isUploading || !content.trim() || hasDateError}
          className="bg-primary w-full rounded-lg py-3 text-white transition-colors hover:bg-indigo-800 disabled:cursor-not-allowed disabled:bg-indigo-300"
        >
          {isUploading ? '이미지 업로드 중...' : isPending ? '수정 중...' : '모집 공고 수정'}
        </button>
      </div>
      <BottomModal isOpen={isChoiceModalOpen} onClose={closeChoiceModal}>
        <div className="flex flex-col gap-6 px-6 pt-7 pb-4">
          <div className="text-h3 text-center whitespace-pre-wrap">기존 모집 공고가 있습니다. 불러와서 수정할까요?</div>
          <div className="flex flex-col gap-2">
            <button
              onClick={applyExistingRecruitment}
              className="bg-primary text-h3 w-full rounded-lg py-3.5 text-center text-white"
            >
              기존 공고 불러오기
            </button>
            <button onClick={handleReset} className="text-h3 w-full rounded-lg py-3.5 text-center text-indigo-400">
              처음부터 작성
            </button>
          </div>
        </div>
      </BottomModal>
    </div>
  );
}

export default ManagedRecruitmentWrite;
