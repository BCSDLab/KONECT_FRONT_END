import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import AddPhotoAlternateIcon from '@/assets/svg/add-photo-alternate.svg';
import CalendarIcon from '@/assets/svg/calendar.svg';
import ChevronLeft from '@/assets/svg/chevron-left.svg';
import ChevronRight from '@/assets/svg/chevron-right.svg';
import ClockIcon from '@/assets/svg/clock.svg';
import BottomModal from '@/components/common/BottomModal';
import ToggleSwitch from '@/components/common/ToggleSwitch';
import DatePicker from '@/pages/Manager/components/DatePicker';
import TimePicker from '@/pages/Manager/components/TimePicker';
import { useCreateRecruitment, useGetManagedRecruitments } from '@/pages/Manager/hooks/useManagedRecruitment';
import { useGetClubSettings, usePatchClubSettings } from '@/pages/Manager/hooks/useManagedSettings';
import useBooleanState from '@/utils/hooks/useBooleanState';
import useUploadImage from '@/utils/hooks/useUploadImage';
import { formatDateDot } from '@/utils/ts/date';
import {
  combineDateTime,
  DEFAULT_END_TIME,
  DEFAULT_START_TIME,
  formatDateTimeDot,
  parseDateTimeDot,
  TIME_MINUTE_STEP,
} from './utils';

interface ImageItem {
  file?: File; // 새 이미지일 경우에만 존재
  previewUrl: string; // 미리보기 URL (blob: 또는 기존 URL)
  isExisting?: boolean; // 기존 이미지 여부
}

const sectionCardStyle = 'flex w-full flex-col rounded-2xl bg-white px-5 py-5';
const sectionTitleStyle = 'text-[16px] leading-[1.6] font-semibold text-indigo-700';
const sectionDividerStyle = 'h-px bg-[#e7ebef]';
const dateFieldContainerStyle = 'rounded-[20px] border-[0.7px] border-[#c6cfd8] bg-white px-3 py-[19px]';
const compactButtonStyle =
  'group flex h-[34px] min-w-0 w-full items-center justify-between rounded-[4px] border-[0.7px] border-[#c6cfd8] bg-white px-1.5 text-left shadow-[0_0_3px_rgba(0,0,0,0.15)]';
const compactButtonTextStyle = 'text-[11px] leading-[1.6] font-medium text-[#344352]';

function ManagedRecruitmentWrite() {
  const { clubId } = useParams<{ clubId: string }>();
  const clubIdNumber = Number(clubId);
  const navigate = useNavigate();
  const location = useLocation();
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState(DEFAULT_START_TIME);
  const [endTime, setEndTime] = useState(DEFAULT_END_TIME);
  const [content, setContent] = useState('');
  const [isAlwaysRecruiting, setIsAlwaysRecruiting] = useState(false);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [hasHandledExisting, setHasHandledExisting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: uploadImage, error: uploadError } = useUploadImage('CLUB');
  const { data: existingRecruitment } = useGetManagedRecruitments(clubIdNumber);
  const { data: clubSettings } = useGetClubSettings(clubIdNumber);
  const { mutate: saveRecruitment, isPending, error } = useCreateRecruitment(clubIdNumber);
  const { mutate: patchSettings, isPending: isSettingsPending } = usePatchClubSettings(clubIdNumber);
  const { value: isChoiceModalOpen, setTrue: openChoiceModal, setFalse: closeChoiceModal } = useBooleanState(false);

  useEffect(() => {
    if (existingRecruitment && !hasHandledExisting) {
      openChoiceModal();
    }
  }, [existingRecruitment, hasHandledExisting, openChoiceModal]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  const applyExistingRecruitment = () => {
    if (!existingRecruitment) return;

    setContent(existingRecruitment.content);
    if (existingRecruitment.startAt && existingRecruitment.endAt) {
      const parsedStart = parseDateTimeDot(existingRecruitment.startAt, DEFAULT_START_TIME);
      const parsedEnd = parseDateTimeDot(existingRecruitment.endAt, DEFAULT_END_TIME);
      if (parsedStart) {
        setStartDate(parsedStart.date);
        setStartTime(parsedStart.time);
      }
      if (parsedEnd) {
        setEndDate(parsedEnd.date);
        setEndTime(parsedEnd.time);
      }
    }
    const isAlways = !existingRecruitment.startAt || !existingRecruitment.endAt;
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

  const startDateTime = combineDateTime(startDate, startTime);
  const endDateTime = combineDateTime(endDate, endTime);
  const isStartAfterEnd = startDateTime >= endDateTime;
  const isEndBeforeNow = endDateTime < new Date();
  const hasDateError = !isAlwaysRecruiting && (isStartAfterEnd || isEndBeforeNow);

  const getDateErrorMessage = () => {
    if (isAlwaysRecruiting) return null;
    if (isStartAfterEnd) return '시작 일시는 종료 일시보다 앞서야 합니다.';
    if (isEndBeforeNow) return '종료 일시는 현재 이후여야 합니다.';
    return null;
  };

  const handleReset = () => {
    setStartDate(new Date());
    setEndDate(new Date());
    setStartTime(DEFAULT_START_TIME);
    setEndTime(DEFAULT_END_TIME);
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
    const targetImage = images[currentImageIndex];

    if (!targetImage) return;
    if (!targetImage.isExisting) {
      URL.revokeObjectURL(targetImage.previewUrl);
    }

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

  const handleRecruitmentEnabledChange = (enabled: boolean) => {
    patchSettings({ isRecruitmentEnabled: enabled });
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

      const onSuccess = () => {
        if (location.state?.enableAfterSave) {
          patchSettings({ isRecruitmentEnabled: true }, { onSuccess: () => navigate(-1) });
        } else {
          navigate(`/mypage/manager/${clubId}/recruitment`);
        }
      };

      if (isAlwaysRecruiting) {
        saveRecruitment({ content, images: imageData, isAlwaysRecruiting: true }, { onSuccess });
      } else {
        saveRecruitment(
          {
            content,
            images: imageData,
            isAlwaysRecruiting: false,
            startAt: formatDateTimeDot(startDate, startTime, DEFAULT_START_TIME),
            endAt: formatDateTimeDot(endDate, endTime, DEFAULT_END_TIME),
          },
          { onSuccess }
        );
      }
    } finally {
      setIsUploading(false);
    }
  };

  const isRecruitmentEnabled = clubSettings?.isRecruitmentEnabled ?? false;
  const recruitmentStatusLabel = isRecruitmentEnabled ? '활성화' : '비활성화';

  return (
    <div className="flex h-full flex-col">
      <form id="recruitment-form" onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-y-auto px-4 pt-4">
        <div className="flex flex-col gap-4 pb-6">
          <div className="flex justify-end">
            <ToggleSwitch
              variant="manager"
              label={recruitmentStatusLabel}
              ariaLabel="모집 공고 활성화 설정"
              enabled={isRecruitmentEnabled}
              onChange={handleRecruitmentEnabledChange}
              disabled={isSettingsPending}
            />
          </div>

          <section className={sectionCardStyle}>
            <div className="flex items-center justify-between gap-3">
              <span className={sectionTitleStyle}>모집 일시</span>
              <ToggleSwitch
                variant="manager"
                label="상시 모집"
                enabled={isAlwaysRecruiting}
                onChange={setIsAlwaysRecruiting}
              />
            </div>
            <div className="mt-5 mb-4">
              <div className={sectionDividerStyle} />
            </div>

            {isAlwaysRecruiting ? (
              <div className={dateFieldContainerStyle}>
                <p className="text-[14px] leading-[1.6] font-medium text-[#5a6b7f]">
                  상시 모집이 설정되어 있어 모집 기간 제한이 없습니다.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className={twMerge(dateFieldContainerStyle, hasDateError && 'border-red-300')}>
                  <div className="flex items-center gap-4">
                    <span className="bg-primary-100 text-primary-900 flex h-[23px] min-w-11 items-center justify-center rounded-full px-[13px] text-[12px] leading-[1.6] font-medium">
                      시작
                    </span>
                    <div className="ml-auto flex w-full max-w-[180px] flex-col gap-[11px]">
                      <DatePicker
                        selectedDate={startDate}
                        onChange={setStartDate}
                        renderTrigger={(toggle) => (
                          <button type="button" onClick={toggle} className={compactButtonStyle}>
                            <span className="flex min-w-0 items-center gap-[5px]">
                              <CalendarIcon aria-hidden="true" className="h-4 w-4 shrink-0 text-indigo-300" />
                              <span className={twMerge(compactButtonTextStyle, 'truncate')}>
                                {formatDateDot(startDate)}
                              </span>
                            </span>
                            <ChevronRight
                              aria-hidden="true"
                              className="h-2.5 w-2.5 shrink-0 text-indigo-100 transition-transform group-hover:translate-x-0.5"
                            />
                          </button>
                        )}
                      />
                      <TimePicker
                        value={startTime}
                        onChange={setStartTime}
                        minuteStep={TIME_MINUTE_STEP}
                        renderTrigger={(toggle) => (
                          <button type="button" onClick={toggle} className={compactButtonStyle}>
                            <span className="flex items-center gap-[5px]">
                              <ClockIcon aria-hidden="true" className="h-4 w-4 shrink-0 text-indigo-300" />
                              <span className={compactButtonTextStyle}>{startTime}</span>
                            </span>
                            <ChevronRight
                              aria-hidden="true"
                              className="h-2.5 w-2.5 shrink-0 text-indigo-100 transition-transform group-hover:translate-x-0.5"
                            />
                          </button>
                        )}
                      />
                    </div>
                  </div>

                  <div className="my-[15px]">
                    <div className={sectionDividerStyle} />
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="bg-sub-100 text-sub-900 flex h-[23px] min-w-11 items-center justify-center rounded-full px-[13px] text-[12px] leading-[1.6] font-medium">
                      종료
                    </span>
                    <div className="ml-auto flex w-full max-w-[180px] flex-col gap-[11px]">
                      <DatePicker
                        selectedDate={endDate}
                        onChange={setEndDate}
                        renderTrigger={(toggle) => (
                          <button type="button" onClick={toggle} className={compactButtonStyle}>
                            <span className="flex min-w-0 items-center gap-[5px]">
                              <CalendarIcon aria-hidden="true" className="h-4 w-4 shrink-0 text-indigo-300" />
                              <span className={twMerge(compactButtonTextStyle, 'truncate')}>
                                {formatDateDot(endDate)}
                              </span>
                            </span>
                            <ChevronRight
                              aria-hidden="true"
                              className="h-2.5 w-2.5 shrink-0 text-indigo-100 transition-transform group-hover:translate-x-0.5"
                            />
                          </button>
                        )}
                      />
                      <TimePicker
                        value={endTime}
                        onChange={setEndTime}
                        minuteStep={TIME_MINUTE_STEP}
                        renderTrigger={(toggle) => (
                          <button type="button" onClick={toggle} className={compactButtonStyle}>
                            <span className="flex items-center gap-[5px]">
                              <ClockIcon aria-hidden="true" className="h-4 w-4 shrink-0 text-indigo-300" />
                              <span className={compactButtonTextStyle}>{endTime}</span>
                            </span>
                            <ChevronRight
                              aria-hidden="true"
                              className="h-2.5 w-2.5 shrink-0 text-indigo-100 transition-transform group-hover:translate-x-0.5"
                            />
                          </button>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {hasDateError && (
                  <div className="rounded-xl bg-red-50 px-3 py-2">
                    <span className="text-[13px] leading-[1.6] font-medium text-red-500">{getDateErrorMessage()}</span>
                  </div>
                )}
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
              className="border-text-200 placeholder:text-text-300 text-text-700 mt-3 min-h-[226px] w-full resize-none overflow-hidden rounded-[20px] border-[0.7px] bg-white px-4 py-4 text-[15px] leading-[1.6] font-medium focus:outline-none"
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

            {images.length === 0 ? (
              <button
                type="button"
                onClick={handleImageClick}
                className="border-text-200 mt-3 flex h-[226px] w-full flex-col items-center justify-center gap-2 rounded-[20px] border-[0.7px] bg-white text-[#5a6b7f]"
              >
                <AddPhotoAlternateIcon aria-hidden="true" className="h-[60px] w-[60px]" />
                <p className="text-center text-[16px] leading-[1.6] font-semibold">이미지를 추가해주세요</p>
              </button>
            ) : (
              <div className="mt-3 flex flex-col gap-3">
                <div className="border-text-200 relative h-[226px] overflow-hidden rounded-[20px] border-[0.7px] bg-white">
                  <img
                    src={images[currentImageIndex].previewUrl}
                    alt={`업로드 이미지 ${currentImageIndex + 1}`}
                    className="h-full w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={handleDeleteImage}
                    aria-label="현재 이미지 삭제"
                    className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/45 text-sm font-semibold text-white"
                  >
                    ×
                  </button>

                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={handlePrevImage}
                        aria-label="이전 이미지"
                        className="absolute top-1/2 left-3 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-[0_0_3px_rgba(0,0,0,0.15)]"
                      >
                        <ChevronLeft aria-hidden="true" className="h-4 w-4 text-indigo-700" />
                      </button>
                      <button
                        type="button"
                        onClick={handleNextImage}
                        aria-label="다음 이미지"
                        className="absolute top-1/2 right-3 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-[0_0_3px_rgba(0,0,0,0.15)]"
                      >
                        <ChevronRight aria-hidden="true" className="h-4 w-4 text-indigo-700" />
                      </button>
                    </>
                  )}
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5">
                    {images.map((_, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setCurrentImageIndex(index)}
                        aria-label={`${index + 1}번 이미지 보기`}
                        className={twMerge(
                          'h-2 w-2 rounded-full transition-colors',
                          index === currentImageIndex ? 'bg-primary-500' : 'bg-text-200'
                        )}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleImageClick}
                    className="bg-primary-500 rounded-full px-4 py-2 text-[13px] leading-[1.6] font-semibold text-white"
                  >
                    이미지 추가
                  </button>
                </div>
              </div>
            )}
          </section>

          <div className="flex flex-col gap-2 pb-[calc(12px+var(--sab))]">
            <div className="flex flex-col gap-1">
              {uploadError && (
                <p className="text-[13px] leading-[1.6] font-medium text-red-500">
                  {uploadError.message ?? '이미지 업로드에 실패했습니다.'}
                </p>
              )}
              {error && (
                <p className="text-[13px] leading-[1.6] font-medium text-red-500">
                  {error.message ?? '모집 공고 수정에 실패했습니다.'}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="bg-primary-500 disabled:bg-text-200 h-12 w-full rounded-2xl text-[18px] leading-[1.6] font-semibold text-white disabled:cursor-not-allowed"
              disabled={isPending || isUploading || !content.trim() || hasDateError}
            >
              {isUploading ? '이미지 업로드 중…' : isPending ? '수정 중…' : '모집공고 수정'}
            </button>
          </div>
        </div>
      </form>
      <BottomModal
        isOpen={isChoiceModalOpen}
        onClose={closeChoiceModal}
        className="overflow-hidden rounded-t-[30px]"
        overlayClassName="bg-black/30"
      >
        <div className="px-[19px] pt-3.5 pb-[calc(14px+var(--sab))]">
          <div className="flex flex-col items-center gap-[13px] px-3 py-2">
            <div className="text-text-700 text-center text-[20px] leading-[1.6] font-semibold whitespace-pre-line">
              {'임시저장된 모집 공고가 있습니다.\n불러와서 수정할까요?'}
            </div>
            <button
              type="button"
              onClick={applyExistingRecruitment}
              className="bg-primary-500 h-12 w-full rounded-2xl text-center text-[18px] leading-[1.6] font-semibold text-white"
            >
              기존 공고 불러오기
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="text-primary-500 h-12 w-full rounded-2xl border border-[#e6e6e6] bg-white text-center text-[18px] leading-[1.6] font-semibold"
            >
              처음부터 작성
            </button>
          </div>
        </div>
      </BottomModal>
    </div>
  );
}

export default ManagedRecruitmentWrite;
