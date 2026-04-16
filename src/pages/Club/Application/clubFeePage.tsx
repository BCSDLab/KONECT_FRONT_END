import { useEffect, useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { clubQueries } from '@/apis/club/queries';
import WarningCircleIcon from '@/assets/svg/warning-circle.svg';
import Card from '@/components/common/Card';
import ImageUploader, { useImageUploader } from '@/components/common/ImageUploader';
import Portal from '@/components/common/Portal';
import { useClubApplicationStore } from '@/stores/clubApplicationStore';
import useBooleanState from '@/utils/hooks/useBooleanState';
import AccountInfoCard from './components/AccountInfo';
import useApplyToClub from './hooks/useApplyToClub';

function ClubFeePage() {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const { data: clubFee } = useSuspenseQuery(clubQueries.fee(Number(clubId)));
  const { applyToClub, isPending: isApplyingToClub } = useApplyToClub(Number(clubId));
  const { answers, clubId: storedClubId } = useClubApplicationStore();
  const {
    images,
    isUploadingImages: isUploadingImage,
    selectedImage,
    setImages,
    uploadImages,
  } = useImageUploader({ target: 'CLUB' });

  const [isPreparingImage, setIsPreparingImage] = useState(false);
  const { value: isImageOpen, setTrue: openImage, setFalse: closeImage } = useBooleanState();
  const isSubmitting = isApplyingToClub || isPreparingImage || isUploadingImage;
  const canSubmitImage = selectedImage?.kind === 'local';

  const handleSubmit = async () => {
    if (!canSubmitImage) return;

    const [feePaymentImageUrl] = await uploadImages([selectedImage]);
    await applyToClub({ answers, feePaymentImageUrl });
  };

  useEffect(() => {
    if (storedClubId == null || storedClubId !== Number(clubId)) {
      navigate(`/clubs/${clubId}/apply`, { replace: true });
    }
  }, [storedClubId, clubId, navigate]);

  return (
    <div
      className="flex flex-1 flex-col justify-between gap-2 px-3 pt-3"
      style={{ marginBottom: 'calc(20px + var(--sab))' }}
    >
      <div className="flex flex-col gap-2">
        <Card className="border-sub-200 bg-sub-100 text-sub-900 flex-row gap-1.5 rounded-lg border">
          <WarningCircleIcon />
          <div>
            <div className="text-xs leading-3.5 font-medium">입금 전 입금자명을 꼭 확인해주세요.</div>
            <div className="mt-1 text-[10px] leading-3">ex) 입금자명 : 2026100999 홍길동</div>
          </div>
        </Card>

        <Card>
          <div className="text-sm leading-4 font-bold text-indigo-700">회비 납부</div>
          <Card className="bg-indigo-25 rounded-sm">
            <div className="text-xs font-medium">납부금액</div>
            <div className="text-primary text-lg leading-5 font-extrabold">
              {clubFee.amount === null ? '-' : `${clubFee.amount.toLocaleString()}원`}
            </div>
          </Card>
        </Card>

        <AccountInfoCard accountInfo={clubFee} />

        <Card>
          <div className="text-sm leading-4 font-bold text-indigo-700">입금 확인 인증</div>
          <ImageUploader
            value={images}
            onChange={setImages}
            selectionMode="single"
            layout="wide"
            className="mt-3"
            onPreparingChange={setIsPreparingImage}
            onPreviewClick={() => openImage()}
            previewAlt={() => '입금 확인'}
          />
        </Card>
      </div>

      <button
        type="button"
        className="bg-primary mt-5 w-full rounded-lg py-2.5 text-center text-lg leading-7 font-bold text-white disabled:opacity-50"
        onClick={handleSubmit}
        disabled={!canSubmitImage || isSubmitting}
      >
        {isPreparingImage ? '이미지 준비 중...' : isSubmitting ? '제출 중...' : '제출하기'}
      </button>

      {isImageOpen && selectedImage && (
        <Portal>
          <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80" onClick={closeImage}>
            <img
              src={selectedImage.previewUrl}
              alt="입금 확인"
              className="max-h-[85vh] max-w-[90vw] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </Portal>
      )}
    </div>
  );
}

export default ClubFeePage;
