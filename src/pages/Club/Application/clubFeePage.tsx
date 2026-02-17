import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ImageIcon from '@/assets/svg/image.svg';
import WarningCircleIcon from '@/assets/svg/warning-circle.svg';
import Card from '@/components/common/Card';
import Portal from '@/components/common/Portal';
import { useClubApplicationStore } from '@/stores/clubApplicationStore';
import useBooleanState from '@/utils/hooks/useBooleanState';
import useUploadImage from '@/utils/hooks/useUploadImage';
import AccountInfoCard from './components/AccountInfo';
import useApplyToClub from './hooks/useApplyToClub';
import { useGetClubFee } from './hooks/useGetClubFee';

function ClubFeePage() {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const { data: clubFee } = useGetClubFee(Number(clubId));
  const { applyToClub } = useApplyToClub(Number(clubId));
  const { answers, clubId: storedClubId } = useClubApplicationStore();

  useEffect(() => {
    if (storedClubId == null || storedClubId !== Number(clubId)) {
      navigate(`/clubs/${clubId}/apply`, { replace: true });
    }
  }, [storedClubId, clubId, navigate]);
  const { mutateAsync: uploadImage } = useUploadImage('CLUB');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { value: isImageOpen, setTrue: openImage, setFalse: closeImage } = useBooleanState();

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!imageFile) return;
    setIsSubmitting(true);

    try {
      const { fileUrl } = await uploadImage(imageFile);
      await applyToClub({ answers, feePaymentImageUrl: fileUrl });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="flex flex-1 flex-col justify-between gap-2 px-3 pt-3"
      style={{ marginBottom: 'calc(20px + var(--sab))' }}
    >
      <div className="flex flex-col gap-2">
        <Card className="flex-row gap-1.5 rounded-lg border border-[#fcedb2] bg-[#fefce8] text-[#713f11]">
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
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
          <div className="flex justify-center">
            {previewUrl ? (
              <div className="relative h-52 w-36 overflow-hidden rounded-xl">
                <button type="button" onClick={openImage} className="h-full w-full">
                  <img src={previewUrl} alt="입금 확인" className="h-full w-full object-cover" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (previewUrl) URL.revokeObjectURL(previewUrl);
                    setPreviewUrl(null);
                    setImageFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="border-indigo-75 hover:bg-indigo-25 flex h-52 w-36 flex-col items-center justify-center gap-2.5 rounded-xl border transition-colors"
              >
                <ImageIcon />
                <p className="text-sub4 text-center whitespace-pre-line text-indigo-100">
                  {'이미지를 \n 추가해주세요'}
                </p>
              </button>
            )}
          </div>
        </Card>
      </div>

      <button
        type="button"
        className="bg-primary mt-5 w-full rounded-lg py-2.5 text-center text-lg leading-7 font-bold text-white disabled:opacity-50"
        onClick={handleSubmit}
        disabled={!imageFile || isSubmitting}
      >
        제출하기
      </button>

      {isImageOpen && previewUrl && (
        <Portal>
          <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/80" onClick={closeImage}>
            <img
              src={previewUrl}
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
