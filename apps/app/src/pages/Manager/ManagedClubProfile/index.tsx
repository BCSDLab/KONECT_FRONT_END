import { type ChangeEvent, useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { clubQueries } from '@/apis/club/queries';
import BottomModal from '@/components/common/BottomModal';
import ImageUploader, { useImageUploader } from '@/components/common/ImageUploader';
import { useToastContext } from '@/contexts/useToastContext';
import { useUpdateManagedClubInfoMutation } from '@/pages/Manager/hooks/useManagedClubMutations';
import useBooleanState from '@/utils/hooks/useBooleanState';
import { getApiErrorMessage, getApiErrorMessages } from '@/utils/ts/error/apiErrorMessage';

const DESCRIPTION_MAX_LENGTH = 25;

const cardClassName = 'rounded-2xl bg-white shadow-[0_0_3px_rgba(0,0,0,0.15)]';
const fieldLabelClassName = 'text-body3-strong text-text-700';
const fieldControlClassName =
  'w-full rounded-lg border border-text-200 bg-white px-3 text-[13px] leading-[20.8px] font-medium text-black outline-none placeholder:text-text-300 focus:border-primary-500';
const fieldInputClassName = `${fieldControlClassName} h-[31px]`;
const disabledFieldInputClassName =
  'h-[31px] w-full rounded-lg border border-transparent bg-background px-3 text-[13px] leading-[20.8px] font-medium text-text-500 outline-none disabled:cursor-not-allowed disabled:opacity-100 disabled:[-webkit-text-fill-color:#5A6B7F]';
const fieldTextAreaClassName = `${fieldControlClassName} min-h-[512px] resize-none py-2.5`;
const clubNameFieldId = 'managed-club-name';
const categoryFieldId = 'managed-club-category';
const descriptionFieldId = 'managed-club-description';
const locationFieldId = 'managed-club-location';
const introduceFieldId = 'managed-club-introduce';

function ManagedClubInfo() {
  const navigate = useNavigate();
  const { showToast } = useToastContext();
  const { clubId } = useParams<{ clubId: string }>();

  const numericClubId = Number(clubId);
  const { data: clubDetail } = useSuspenseQuery(clubQueries.detail(numericClubId));
  const { mutateAsync: updateClubInfo, isPending, error } = useUpdateManagedClubInfoMutation(numericClubId);

  const initialDescription = clubDetail.description ?? '';
  const initialLocation = clubDetail.location ?? '';
  const initialIntroduce = clubDetail.introduce ?? '';
  const initialImageUrl = clubDetail.imageUrl ?? '';

  const [description, setDescription] = useState(initialDescription);
  const [location, setLocation] = useState(initialLocation);
  const [introduce, setIntroduce] = useState(initialIntroduce);
  const {
    images,
    selectedImage: currentImage,
    selectedImageUrl: currentImageUrl,
    setImages,
    isUploadingImages: isUploadingImage,
    uploadError,
    uploadImages,
  } = useImageUploader({ initialImageUrls: initialImageUrl ? [initialImageUrl] : [], target: 'CLUB' });
  const [isPreparingImage, setIsPreparingImage] = useState(false);

  const { value: isSubmitModalOpen, setTrue: openSubmitModal, setFalse: closeSubmitModal } = useBooleanState(false);

  const hasChanges =
    description !== initialDescription ||
    location !== initialLocation ||
    introduce !== initialIntroduce ||
    currentImageUrl !== initialImageUrl;

  const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.length <= DESCRIPTION_MAX_LENGTH) {
      setDescription(value);
    }
  };

  const handleSubmit = async () => {
    closeSubmitModal();
    const [finalImageUrl = ''] = await uploadImages(currentImage ? [currentImage] : []);

    await updateClubInfo({
      description,
      imageUrl: finalImageUrl,
      location,
      introduce,
    });

    showToast('클럽 정보가 수정되었습니다');
    navigate(-1);
  };

  const readOnlyFields = [
    { id: clubNameFieldId, label: '동아리명', value: clubDetail.name },
    { id: categoryFieldId, label: '분과', value: clubDetail.categoryName },
  ];

  return (
    <div className="bg-background flex min-h-full flex-col px-4 pt-5">
      <div className="mx-auto flex w-full max-w-88 flex-1 flex-col gap-5 pb-[calc(40px+var(--sab))]">
        <section className="flex justify-center">
          <ImageUploader
            value={images}
            onChange={setImages}
            selectionMode="single"
            layout="square"
            className={`${cardClassName} relative size-62.5 p-3`}
            onPreparingChange={setIsPreparingImage}
            previewAlt={() => '동아리 이미지 미리보기'}
          />
        </section>

        <section className={`${cardClassName} px-5 py-6`}>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-h3 text-indigo-700">정보 수정</h2>
              <div className="h-5.5 w-0" aria-hidden="true" />
            </div>

            {readOnlyFields.map(({ id, label, value }) => (
              <div key={id} className="flex flex-col gap-1">
                <label htmlFor={id} className={fieldLabelClassName}>
                  {label}
                </label>
                <input id={id} value={value ?? ''} readOnly disabled className={disabledFieldInputClassName} />
              </div>
            ))}

            <div className="flex flex-col gap-1">
              <div className="flex items-end justify-between gap-3">
                <label htmlFor={descriptionFieldId} className={fieldLabelClassName}>
                  한 줄 소개
                </label>
                <span className="text-cap1 text-text-300">
                  {description.length}/{DESCRIPTION_MAX_LENGTH}
                </span>
              </div>
              <input
                id={descriptionFieldId}
                value={description}
                onChange={handleDescriptionChange}
                placeholder="한 줄 소개를 입력해주세요"
                maxLength={DESCRIPTION_MAX_LENGTH}
                className={fieldInputClassName}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor={locationFieldId} className={fieldLabelClassName}>
                동아리방 위치
              </label>
              <input
                id={locationFieldId}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="동아리방 위치를 입력해주세요"
                className={fieldInputClassName}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor={introduceFieldId} className={fieldLabelClassName}>
                상세 소개
              </label>
              <textarea
                id={introduceFieldId}
                value={introduce}
                onChange={(e) => setIntroduce(e.target.value)}
                placeholder="동아리 상세 소개를 입력해주세요"
                rows={5}
                className={fieldTextAreaClassName}
              />
            </div>
          </div>
        </section>

        <div className="mt-auto flex flex-col gap-2 pt-3">
          {uploadError && (
            <p className="text-body3 text-danger-700">
              {getApiErrorMessage(uploadError, '이미지 업로드에 실패했습니다.')}
            </p>
          )}
          {error &&
            getApiErrorMessages(error, '동아리 정보 수정에 실패했습니다.').map((message) => (
              <p key={message} className="text-body3 text-danger-700">
                {message}
              </p>
            ))}
          <button
            type="button"
            onClick={openSubmitModal}
            disabled={isPending || isPreparingImage || isUploadingImage || !hasChanges}
            className="text-h2 bg-primary-500 disabled:bg-text-300 w-full rounded-2xl py-[9.5px] text-center text-white transition-colors disabled:cursor-not-allowed"
          >
            {isPreparingImage
              ? '이미지 준비 중...'
              : isUploadingImage
                ? '이미지 업로드 중...'
                : isPending
                  ? '수정 중...'
                  : '수정하기'}
          </button>
        </div>
      </div>

      <BottomModal isOpen={isSubmitModalOpen} onClose={closeSubmitModal}>
        <div className="flex flex-col gap-10 px-8 pt-7 pb-4">
          <div className="text-h3 text-center whitespace-pre-wrap">동아리 정보를 수정하시겠어요?</div>
          <div>
            <button
              type="button"
              disabled={isPending || isPreparingImage || isUploadingImage}
              onClick={handleSubmit}
              className="bg-primary-500 text-h3 w-full rounded-lg py-3.5 text-center text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPreparingImage
                ? '이미지 준비 중...'
                : isUploadingImage
                  ? '수정 중...'
                  : isPending
                    ? '수정 중...'
                    : '수정하기'}
            </button>
            <button
              type="button"
              onClick={closeSubmitModal}
              className="text-h3 text-text-500 w-full rounded-lg py-3.5 text-center"
            >
              취소하기
            </button>
          </div>
        </div>
      </BottomModal>
    </div>
  );
}

export default ManagedClubInfo;
