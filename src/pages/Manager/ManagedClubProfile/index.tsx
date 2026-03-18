import { type ChangeEvent, type MutableRefObject, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import ImageIcon from '@/assets/svg/image.svg';
import BottomModal from '@/components/common/BottomModal';
import { isApiError } from '@/interface/error';
import { useGetClubDetail } from '@/pages/Club/ClubDetail/hooks/useGetClubDetail';
import { useUpdateClubInfo } from '@/pages/Manager/hooks/useManagedClubs';
import useBooleanState from '@/utils/hooks/useBooleanState';
import useUploadImage from '@/utils/hooks/useUploadImage';

const DESCRIPTION_MAX_LENGTH = 25;

const cardClassName = 'rounded-2xl bg-white shadow-[0_0_3px_rgba(0,0,0,0.15)]';
const fieldLabelClassName = 'text-body3-strong text-text-700';
const fieldControlClassName =
  'w-full rounded-lg border border-text-200 bg-white px-3 text-[13px] leading-[20.8px] font-medium text-black outline-none placeholder:text-text-300 focus:border-primary-500';
const fieldInputClassName = `${fieldControlClassName} h-[31px]`;
const disabledFieldInputClassName =
  'h-[31px] w-full rounded-lg border border-transparent bg-background px-3 text-[13px] leading-[20.8px] font-medium text-text-500 outline-none disabled:cursor-not-allowed disabled:opacity-100 disabled:[-webkit-text-fill-color:#5A6B7F]';
const fieldTextAreaClassName = `${fieldControlClassName} min-h-[512px] resize-none py-2.5`;
const imageActionButtonClassName =
  'absolute flex size-[25px] items-center justify-center rounded-full bg-[#9f9f9f] text-[18px] leading-none text-white shadow-[0_1px_2px_rgba(0,0,0,0.16)]';
const clubNameFieldId = 'managed-club-name';
const categoryFieldId = 'managed-club-category';
const descriptionFieldId = 'managed-club-description';
const locationFieldId = 'managed-club-location';
const introduceFieldId = 'managed-club-introduce';

function clearLocalPreviewUrl(localPreviewUrlRef: MutableRefObject<string | null>) {
  if (!localPreviewUrlRef.current) return;

  URL.revokeObjectURL(localPreviewUrlRef.current);
  localPreviewUrlRef.current = null;
}

function ManagedClubInfo() {
  const { clubId } = useParams<{ clubId: string }>();
  const numericClubId = Number(clubId);
  const { data: clubDetail } = useGetClubDetail(numericClubId);

  const initialDescription = clubDetail.description ?? '';
  const initialLocation = clubDetail.location ?? '';
  const initialIntroduce = clubDetail.introduce ?? '';
  const initialImageUrl = clubDetail.imageUrl ?? '';

  const [description, setDescription] = useState(initialDescription);
  const [location, setLocation] = useState(initialLocation);
  const [introduce, setIntroduce] = useState(initialIntroduce);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState(initialImageUrl);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const localPreviewUrlRef = useRef<string | null>(null);

  const { mutateAsync: uploadImage, error: uploadError } = useUploadImage('CLUB');
  const { mutateAsync: updateClubInfo, isPending, error } = useUpdateClubInfo(numericClubId);
  const { value: isSubmitModalOpen, setTrue: openSubmitModal, setFalse: closeSubmitModal } = useBooleanState(false);

  useEffect(() => {
    clearLocalPreviewUrl(localPreviewUrlRef);
    setDescription(initialDescription);
    setLocation(initialLocation);
    setIntroduce(initialIntroduce);
    setImageFile(null);
    setImagePreview(initialImageUrl);
  }, [initialDescription, initialImageUrl, initialIntroduce, initialLocation]);

  useEffect(() => {
    return () => {
      clearLocalPreviewUrl(localPreviewUrlRef);
    };
  }, []);

  const hasChanges =
    description !== initialDescription ||
    location !== initialLocation ||
    introduce !== initialIntroduce ||
    imagePreview !== initialImageUrl;

  const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.length <= DESCRIPTION_MAX_LENGTH) {
      setDescription(value);
    }
  };

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    clearLocalPreviewUrl(localPreviewUrlRef);

    const previewUrl = URL.createObjectURL(file);
    localPreviewUrlRef.current = previewUrl;

    setImageFile(file);
    setImagePreview(previewUrl);
    e.target.value = '';
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleDeleteImage = () => {
    clearLocalPreviewUrl(localPreviewUrlRef);
    setImageFile(null);
    setImagePreview('');
  };

  const handleSubmit = async () => {
    closeSubmitModal();
    setIsUploading(true);

    try {
      let finalImageUrl = imagePreview;

      if (imageFile) {
        const result = await uploadImage(imageFile);
        finalImageUrl = result.fileUrl;
      }

      await updateClubInfo({
        description,
        imageUrl: finalImageUrl,
        location,
        introduce,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const readOnlyFields = [
    { id: clubNameFieldId, label: '동아리명', value: clubDetail.name },
    { id: categoryFieldId, label: '분과', value: clubDetail.categoryName },
  ];

  return (
    <div className="bg-background flex min-h-full flex-col px-4 pt-5">
      <div className="mx-auto flex w-full max-w-[352px] flex-1 flex-col gap-5 pb-[calc(40px+var(--sab))]">
        <section className="flex justify-center">
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
          <div className={`${cardClassName} relative size-[250px] p-3`}>
            {!imagePreview ? (
              <button
                type="button"
                onClick={handleImageClick}
                className="border-text-200 bg-background hover:bg-primary-100/50 flex size-full flex-col items-center justify-center gap-3 rounded-sm border border-dashed transition-colors"
              >
                <ImageIcon aria-hidden="true" />
                <p className="text-sub3 text-text-500 text-center whitespace-pre-line">
                  동아리 이미지를{'\n'}추가해주세요
                </p>
              </button>
            ) : (
              <>
                <div className="flex h-full items-center justify-center overflow-hidden rounded-sm bg-white p-4">
                  <img src={imagePreview} alt="동아리 이미지 미리보기" className="max-h-full w-full object-contain" />
                </div>
                <button
                  type="button"
                  aria-label="이미지 삭제"
                  onClick={handleDeleteImage}
                  className={`${imageActionButtonClassName} top-2 right-2`}
                >
                  <span className="-mt-px">×</span>
                </button>
                <button
                  type="button"
                  aria-label="이미지 변경"
                  onClick={handleImageClick}
                  className={`${imageActionButtonClassName} right-2 bottom-2`}
                >
                  <span className="-mt-px">+</span>
                </button>
              </>
            )}
          </div>
        </section>

        <section className={`${cardClassName} px-5 py-6`}>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-h3 text-indigo-700">정보 수정</h2>
              <div className="h-[22px] w-0" aria-hidden="true" />
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
            <p className="text-body3 text-danger-700">{uploadError.message ?? '이미지 업로드에 실패했습니다.'}</p>
          )}
          {error && isApiError(error) && error.apiError?.fieldErrors?.length
            ? error.apiError.fieldErrors.map((fieldError) => (
                <p key={fieldError.field} className="text-body3 text-danger-700">
                  {fieldError.message}
                </p>
              ))
            : error && (
                <p className="text-body3 text-danger-700">{error.message ?? '동아리 정보 수정에 실패했습니다.'}</p>
              )}
          <button
            type="button"
            onClick={openSubmitModal}
            disabled={isPending || isUploading || !hasChanges}
            className="text-h2 bg-primary-500 disabled:bg-text-300 w-full rounded-2xl py-[9.5px] text-center text-white transition-colors disabled:cursor-not-allowed"
          >
            {isUploading ? '이미지 업로드 중...' : isPending ? '수정 중...' : '수정하기'}
          </button>
        </div>
      </div>

      <BottomModal isOpen={isSubmitModalOpen} onClose={closeSubmitModal}>
        <div className="flex flex-col gap-10 px-8 pt-7 pb-4">
          <div className="text-h3 text-center whitespace-pre-wrap">동아리 정보를 수정하시겠어요?</div>
          <div>
            <button
              type="button"
              disabled={isPending || isUploading}
              onClick={handleSubmit}
              className="bg-primary-500 text-h3 w-full rounded-lg py-3.5 text-center text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isUploading ? '수정 중...' : isPending ? '수정 중...' : '수정하기'}
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
