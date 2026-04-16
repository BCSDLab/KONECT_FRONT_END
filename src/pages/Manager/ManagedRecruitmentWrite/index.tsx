import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { managedClubQueries } from '@/apis/club/managedQueries';
import CalendarIcon from '@/assets/svg/calendar.svg';
import ChevronRight from '@/assets/svg/chevron-right.svg';
import ClockIcon from '@/assets/svg/clock.svg';
import BottomModal from '@/components/common/BottomModal';
import ImageUploader, { useImageUploader } from '@/components/common/ImageUploader';
import ToggleSwitch from '@/components/common/ToggleSwitch';
import { useToastContext } from '@/contexts/useToastContext';
import DatePicker from '@/pages/Manager/components/DatePicker';
import TimePicker from '@/pages/Manager/components/TimePicker';
import {
  usePatchManagedClubSettingsMutation,
  useUpsertManagedClubRecruitmentMutation,
} from '@/pages/Manager/hooks/useManagedClubMutations';
import { useApiErrorToast } from '@/utils/hooks/error/useApiErrorToast';
import useBooleanState from '@/utils/hooks/useBooleanState';
import { cn } from '@/utils/ts/cn';
import { formatDateDot } from '@/utils/ts/datetime/date';
import { getApiErrorMessage } from '@/utils/ts/error/apiErrorMessage';
import {
  combineDateTime,
  DEFAULT_END_TIME,
  DEFAULT_START_TIME,
  formatDateTimeDot,
  parseDateTimeDot,
  TIME_MINUTE_STEP,
} from './utils';

const sectionCardStyle = 'flex w-full flex-col rounded-2xl bg-white px-5 py-5';
const sectionTitleStyle = 'text-[16px] leading-[1.6] font-semibold text-indigo-700';
const sectionDividerStyle = 'h-px bg-[#e7ebef]';
const dateFieldContainerStyle = 'rounded-[20px] border-[0.7px] border-[#c6cfd8] bg-white px-3 py-[19px]';
const compactButtonStyle =
  'group flex h-[34px] min-w-0 w-full items-center justify-between rounded-[4px] border-[0.7px] border-[#c6cfd8] bg-white px-1.5 text-left shadow-[0_0_3px_rgba(0,0,0,0.15)]';
const compactButtonTextStyle = 'text-[11px] leading-[1.6] font-medium text-[#344352]';

function ManagedRecruitmentWrite() {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToastContext();
  const showApiErrorToast = useApiErrorToast();
  const { clubId } = useParams<{ clubId: string }>();
  const clubIdNumber = Number(clubId);

  const { images, resetImages, setImages, isUploadingImages, uploadError, uploadImages } = useImageUploader({
    target: 'CLUB',
  });
  const { data: existingRecruitment } = useQuery(managedClubQueries.recruitment(clubIdNumber));
  const { data: clubSettings } = useQuery(managedClubQueries.settings(clubIdNumber));
  const { mutateAsync: saveRecruitment, isPending, error } = useUpsertManagedClubRecruitmentMutation(clubIdNumber);
  const { mutateAsync: patchSettings, isPending: isSettingsPending } =
    usePatchManagedClubSettingsMutation(clubIdNumber);

  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState(DEFAULT_START_TIME);
  const [endTime, setEndTime] = useState(DEFAULT_END_TIME);
  const [content, setContent] = useState('');
  const [recruitmentEnabledOverride, setRecruitmentEnabledOverride] = useState<boolean | null>(null);
  const [isAlwaysRecruiting, setIsAlwaysRecruiting] = useState(false);
  const [isPreparingImages, setIsPreparingImages] = useState(false);
  const [hasHandledExisting, setHasHandledExisting] = useState(false);
  const { value: isChoiceModalOpen, setTrue: openChoiceModal, setFalse: closeChoiceModal } = useBooleanState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isRecruitmentEnabled = recruitmentEnabledOverride ?? clubSettings?.isRecruitmentEnabled ?? false;

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
    resetImages(existingRecruitment.images?.map((img) => img.url) ?? []);
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
    resetImages();
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

  const handleRecruitmentEnabledChange = (enabled: boolean) => {
    setRecruitmentEnabledOverride(enabled);
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const imageUrls = await uploadImages(images);
    const imageData = imageUrls.map((url) => ({ url }));
    const shouldNavigateBack = Boolean(location.state?.enableAfterSave);
    const previousRecruitmentEnabled = clubSettings?.isRecruitmentEnabled ?? false;
    const nextRecruitmentEnabled = shouldNavigateBack ? true : isRecruitmentEnabled;
    const navigateAfterSave = () =>
      shouldNavigateBack ? navigate(-1) : navigate(`/mypage/manager/${clubId}/recruitment`);

    if (isAlwaysRecruiting) {
      await saveRecruitment({ content, images: imageData, isAlwaysRecruiting: true });
    } else {
      await saveRecruitment({
        content,
        images: imageData,
        isAlwaysRecruiting: false,
        startAt: formatDateTimeDot(startDate, startTime, DEFAULT_START_TIME),
        endAt: formatDateTimeDot(endDate, endTime, DEFAULT_END_TIME),
      });
    }

    if (clubSettings?.isRecruitmentEnabled !== nextRecruitmentEnabled) {
      try {
        await patchSettings({ isRecruitmentEnabled: nextRecruitmentEnabled });
      } catch (apiError) {
        showApiErrorToast(apiError, '모집 공고 활성화 설정에 실패했습니다.');
        setRecruitmentEnabledOverride(previousRecruitmentEnabled);
        return;
      }
    }

    showToast(existingRecruitment ? '모집 공고가 수정되었습니다' : '모집 공고가 생성되었습니다', 'success');
    navigateAfterSave();
  };

  const recruitmentStatusLabel = isRecruitmentEnabled ? '활성화' : '비활성화';
  const isSavingRecruitment = isPending || isSettingsPending;
  const recruitmentActionText = existingRecruitment ? '모집공고 수정' : '모집공고 등록';

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
              disabled={isSavingRecruitment}
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
                <div className={cn(dateFieldContainerStyle, hasDateError && 'border-red-300')}>
                  <div className="flex items-center gap-4">
                    <span className="bg-primary-100 text-primary-900 flex h-5.75 min-w-11 items-center justify-center rounded-full px-3.25 text-[12px] leading-[1.6] font-medium">
                      시작
                    </span>
                    <div className="ml-auto flex w-full max-w-45 flex-col gap-2.75">
                      <DatePicker
                        selectedDate={startDate}
                        onChange={setStartDate}
                        renderTrigger={(toggle) => (
                          <button type="button" onClick={toggle} className={compactButtonStyle}>
                            <span className="flex min-w-0 items-center gap-1.25">
                              <CalendarIcon aria-hidden="true" className="h-4 w-4 shrink-0 text-indigo-300" />
                              <span className={cn(compactButtonTextStyle, 'truncate')}>{formatDateDot(startDate)}</span>
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
                            <span className="flex items-center gap-1.25">
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

                  <div className="my-3.75">
                    <div className={sectionDividerStyle} />
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="bg-sub-100 text-sub-900 flex h-5.75 min-w-11 items-center justify-center rounded-full px-3.25 text-[12px] leading-[1.6] font-medium">
                      종료
                    </span>
                    <div className="ml-auto flex w-full max-w-45 flex-col gap-2.75">
                      <DatePicker
                        selectedDate={endDate}
                        onChange={setEndDate}
                        renderTrigger={(toggle) => (
                          <button type="button" onClick={toggle} className={compactButtonStyle}>
                            <span className="flex min-w-0 items-center gap-1.25">
                              <CalendarIcon aria-hidden="true" className="h-4 w-4 shrink-0 text-indigo-300" />
                              <span className={cn(compactButtonTextStyle, 'truncate')}>{formatDateDot(endDate)}</span>
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
                            <span className="flex items-center gap-1.25">
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
              className="border-text-200 placeholder:text-text-300 text-text-700 mt-3 min-h-56.5 w-full resize-none overflow-hidden rounded-[20px] border-[0.7px] bg-white px-4 py-4 text-[15px] leading-[1.6] font-medium focus:outline-none"
              placeholder="모집 공고 내용을 작성해주세요"
            />
          </section>

          <section className={sectionCardStyle}>
            <span className={sectionTitleStyle}>이미지 등록</span>
            <ImageUploader
              value={images}
              onChange={setImages}
              selectionMode="multiple"
              layout="wide"
              className="mt-3"
              onPreparingChange={setIsPreparingImages}
            />
          </section>

          <div className="flex flex-col gap-2 pb-[calc(12px+var(--sab))]">
            <div className="flex flex-col gap-1">
              {uploadError && (
                <p className="text-[13px] leading-[1.6] font-medium text-red-500">
                  {getApiErrorMessage(uploadError, '이미지 업로드에 실패했습니다.')}
                </p>
              )}
              {error && (
                <p className="text-[13px] leading-[1.6] font-medium text-red-500">
                  {getApiErrorMessage(
                    error,
                    existingRecruitment ? '모집 공고 수정에 실패했습니다.' : '모집 공고 등록에 실패했습니다.'
                  )}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="bg-primary-500 disabled:bg-text-200 h-12 w-full rounded-2xl text-[18px] leading-[1.6] font-semibold text-white disabled:cursor-not-allowed"
              disabled={
                isSavingRecruitment || isPreparingImages || isUploadingImages || !content.trim() || hasDateError
              }
            >
              {isPreparingImages
                ? '이미지 준비 중…'
                : isUploadingImages
                  ? '이미지 업로드 중…'
                  : isSavingRecruitment
                    ? `${recruitmentActionText} 중…`
                    : recruitmentActionText}
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
        <div className="px-4.75 pt-3.5 pb-[calc(14px+var(--sab))]">
          <div className="flex flex-col items-center gap-3.25 px-3 py-2">
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
