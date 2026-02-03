import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import ChevronLeft from '@/assets/svg/chevron-left.svg';
import ChevronRight from '@/assets/svg/chevron-right.svg';
import ImageIcon from '@/assets/svg/image.svg';
import DatePicker from '@/pages/Manager/components/DatePicker';
import { useManagedClubRecruitment, useManagedClubRecruitmentQuery } from '@/pages/Manager/hooks/useManagerQuery';

const dateButtonStyle = twMerge(
  'rounded-lg bg-white px-4 py-2 text-indigo-700 transition-colors active:bg-indigo-25 shadow-[0_2px_4px_rgba(0,0,0,0.1)] text-h1 font-bold'
);

function formatDateDot(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

function ManagedRecruitmentWrite() {
  const { clubId } = useParams<{ clubId: string }>();
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [content, setContent] = useState('');
  const [isAlwaysRecruiting, setIsAlwaysRecruiting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: existingRecruitment } = useManagedClubRecruitmentQuery(Number(clubId));
  const hasExisting = !!existingRecruitment;
  const { mutate: saveRecruitment, isPending, error } = useManagedClubRecruitment(Number(clubId), hasExisting);

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

    const newImageUrls = Array.from(files).map((file) => URL.createObjectURL(file));
    setImages((prev) => {
      const newImages = [...prev, ...newImageUrls];
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const imageData = images.map((url) => ({ url }));

    if (isAlwaysRecruiting) {
      saveRecruitment(
        {
          content,
          images: imageData,
          isAlwaysRecruiting: true,
        },
        {
          onSuccess: () => {
            navigate(`/manager/${clubId}/recruitment`);
          },
        }
      );
    } else {
      saveRecruitment(
        {
          content,
          images: imageData,
          isAlwaysRecruiting: false,
          startDate: formatDateDot(startDate),
          endDate: formatDateDot(endDate),
        },
        {
          onSuccess: () => {
            navigate(`/manager/${clubId}/recruitment`);
          },
        }
      );
    }
  };

  return (
    <div className="flex h-full flex-col">
      <form id="recruitment-form" onSubmit={handleSubmit} className="flex flex-1 flex-col gap-6 overflow-auto p-3">
        <section className="flex w-full flex-col gap-4">
          <div className="flex justify-between">
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
                      src={images[currentImageIndex]}
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
        {error && (
          <p className="text-sm text-red-500">
            {error.message ?? (hasExisting ? '모집 공고 수정에 실패했습니다.' : '모집 공고 등록에 실패했습니다.')}
          </p>
        )}
        <button
          type="submit"
          form="recruitment-form"
          disabled={isPending || !content.trim() || hasDateError}
          className="bg-primary w-full rounded-lg py-3 text-white transition-colors hover:bg-indigo-800 disabled:cursor-not-allowed disabled:bg-indigo-300"
        >
          {isPending ? (hasExisting ? '수정 중...' : '등록 중...') : hasExisting ? '모집 공고 수정' : '모집 공고 등록'}
        </button>
      </div>
    </div>
  );
}

export default ManagedRecruitmentWrite;
