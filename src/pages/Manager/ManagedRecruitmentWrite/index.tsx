import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import CalendarIcon from '@/assets/svg/calendar.svg';
import ChevronLeft from '@/assets/svg/chevron-left.svg';
import ChevronRight from '@/assets/svg/chevron-right.svg';
import ImageIcon from '@/assets/svg/image.svg';
import BottomModal from '@/components/common/BottomModal';
import ToggleSwitch from '@/components/common/ToggleSwitch';
import DatePicker from '@/pages/Manager/components/DatePicker';
import { useCreateRecruitment, useGetManagedRecruitments } from '@/pages/Manager/hooks/useManagedRecruitment';
import useBooleanState from '@/utils/hooks/useBooleanState';
import useUploadImage from '@/utils/hooks/useUploadImage';

interface ImageItem {
  file?: File; // 새 이미지일 경우에만 존재
  previewUrl: string; // 미리보기 URL (blob: 또는 기존 URL)
  isExisting?: boolean; // 기존 이미지 여부
}

const dateButtonStyle =
  'group flex min-h-14 w-full items-center justify-between rounded-xl border border-indigo-50 bg-white px-4 py-3.5 text-left shadow-[0_6px_16px_rgba(2,23,48,0.08)]';
const sectionCardStyle =
  'flex w-full flex-col gap-4 rounded-2xl border border-indigo-25 bg-white px-4 py-4 shadow-[0_4px_12px_rgba(2,23,48,0.06)]';
const sectionTitleStyle = 'text-h3 text-indigo-700';

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

  const { mutateAsync: uploadImage, error: uploadError } = useUploadImage('CLUB');
  const { data: existingRecruitment } = useGetManagedRecruitments(Number(clubId));
  const { mutate: saveRecruitment, isPending, error } = useCreateRecruitment(Number(clubId));
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
      <form
        id="recruitment-form"
        onSubmit={handleSubmit}
        className="flex flex-col gap-5 p-4"
        style={{ paddingBottom: 'calc(20px + var(--sab) + 16px)' }}
      >
        <section className={twMerge(sectionCardStyle, 'gap-3')}>
          <div className="flex items-center justify-between gap-3">
            <span className={sectionTitleStyle}>모집 일시</span>
            <ToggleSwitch
              label="상시 모집"
              enabled={isAlwaysRecruiting}
              onChange={setIsAlwaysRecruiting}
              layout="horizontal"
            />
          </div>
          <div className="h-px bg-indigo-50" />
          {isAlwaysRecruiting ? (
            <p className="text-body2 text-indigo-300">상시 모집이 설정되어 있어 모집 기간 제한이 없습니다.</p>
          ) : (
            <div className="flex flex-col gap-3">
              <DatePicker
                selectedDate={startDate}
                onChange={setStartDate}
                renderTrigger={(toggle) => (
                  <button type="button" onClick={toggle} className={dateButtonStyle}>
                    <div className="flex items-center gap-3">
                      <span className="bg-indigo-25 flex h-8 w-8 items-center justify-center rounded-lg text-indigo-500">
                        <CalendarIcon aria-hidden="true" className="h-4 w-4" />
                      </span>
                      <span className="flex flex-col leading-none">
                        <span className="text-cap1 text-indigo-300">시작일</span>
                        <span className="text-h2 mt-1 text-indigo-700">{formatDateDot(startDate)}</span>
                      </span>
                    </div>
                    <span className="bg-indigo-5 flex h-7 w-7 items-center justify-center rounded-full text-indigo-300">
                      <ChevronRight
                        aria-hidden="true"
                        className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                      />
                    </span>
                  </button>
                )}
              />
              <div className="mx-2 flex items-center gap-2">
                <div className="h-px flex-1 bg-indigo-50" />
                <span className="text-cap1 text-indigo-300">~</span>
                <div className="h-px flex-1 bg-indigo-50" />
              </div>
              <DatePicker
                selectedDate={endDate}
                onChange={setEndDate}
                renderTrigger={(toggle) => (
                  <button type="button" onClick={toggle} className={dateButtonStyle}>
                    <div className="flex items-center gap-3">
                      <span className="bg-indigo-25 flex h-8 w-8 items-center justify-center rounded-lg text-indigo-500">
                        <CalendarIcon aria-hidden="true" className="h-4 w-4" />
                      </span>
                      <span className="flex flex-col leading-none">
                        <span className="text-cap1 text-indigo-300">종료일</span>
                        <span className="text-h2 mt-1 text-indigo-700">{formatDateDot(endDate)}</span>
                      </span>
                    </div>
                    <span className="bg-indigo-5 flex h-7 w-7 items-center justify-center rounded-full text-indigo-300">
                      <ChevronRight
                        aria-hidden="true"
                        className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                      />
                    </span>
                  </button>
                )}
              />
              {hasDateError && <p className="text-body3 text-red-500">{getDateErrorMessage()}</p>}
            </div>
          )}
        </section>
        <section className={sectionCardStyle}>
          <span className={sectionTitleStyle}>
            모집 공고 <span className="text-[#EA4335]">*</span>
          </span>
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleContentChange}
            rows={6}
            className="text-body1 bg-indigo-0 mt-1 min-h-[156px] w-full resize-none overflow-hidden rounded-xl border border-indigo-50 px-4 py-3.5 text-indigo-700 shadow-[0_2px_6px_rgba(2,23,48,0.08)] placeholder:text-indigo-200"
            placeholder="모집 공고 내용을 작성해주세요"
          />
        </section>
        <section className={sectionCardStyle}>
          <span className={sectionTitleStyle}>이미지 등록</span>
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
                className="border-indigo-75 bg-indigo-0 flex h-44 w-full max-w-[260px] flex-col items-center justify-center gap-3 rounded-2xl border"
              >
                <ImageIcon aria-hidden="true" />
                <p className="text-sub3 text-center whitespace-pre-line text-indigo-300">
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
                      aria-label="이전 이미지"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md"
                    >
                      <ChevronLeft aria-hidden="true" className="h-5 w-5 text-indigo-700" />
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
                      aria-label="현재 이미지 삭제"
                      className="absolute top-1 right-1 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white"
                    >
                      ✕
                    </button>
                  </div>
                  {images.length > 1 && (
                    <button
                      type="button"
                      onClick={handleNextImage}
                      aria-label="다음 이미지"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md"
                    >
                      <ChevronRight aria-hidden="true" className="h-5 w-5 text-indigo-700" />
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
                          aria-label={`${index + 1}번 이미지 보기`}
                          className={twMerge(
                            'h-2.5 w-2.5 rounded-full',
                            index === currentImageIndex ? 'bg-indigo-700' : 'bg-indigo-200'
                          )}
                        />
                      ))}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleImageClick}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-700 text-white"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
        <div className="mt-1 flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            {uploadError && (
              <p className="text-body3 text-red-500">{uploadError.message ?? '이미지 업로드에 실패했습니다.'}</p>
            )}
            {error && <p className="text-body3 text-red-500">{error.message ?? '모집 공고 수정에 실패했습니다.'}</p>}
          </div>
          <button
            type="submit"
            disabled={isPending || isUploading || !content.trim() || hasDateError}
            className="text-h3 bg-primary w-full rounded-xl py-3.5 text-white"
          >
            {isUploading ? '이미지 업로드 중…' : isPending ? '수정 중…' : '모집 공고 수정'}
          </button>
        </div>
      </form>
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
