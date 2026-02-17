import { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import ImageIcon from '@/assets/svg/image.svg';
import BottomModal from '@/components/common/BottomModal';
import { useGetClubDetail } from '@/pages/Club/ClubDetail/hooks/useGetClubDetail';
import { useUpdateClubInfo } from '@/pages/Manager/hooks/useManagedClubs';
import useBooleanState from '@/utils/hooks/useBooleanState';
import useUploadImage from '@/utils/hooks/useUploadImage';

const DESCRIPTION_MAX_LENGTH = 20;

function ManagedClubInfo() {
  const { clubId } = useParams<{ clubId: string }>();
  const { data: clubDetail } = useGetClubDetail(Number(clubId));

  const [description, setDescription] = useState(clubDetail.description ?? '');
  const [location, setLocation] = useState(clubDetail.location ?? '');
  const [introduce, setIntroduce] = useState(clubDetail.introduce ?? '');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(clubDetail.imageUrl ?? '');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: uploadImage, error: uploadError } = useUploadImage('CLUB');
  const { mutate: updateClubInfo, isPending, error } = useUpdateClubInfo(Number(clubId));

  const { value: isSubmitModalOpen, setTrue: openSubmitModal, setFalse: closeSubmitModal } = useBooleanState(false);

  const initialDescription = clubDetail.description ?? '';
  const initialLocation = clubDetail.location ?? '';
  const initialIntroduce = clubDetail.introduce ?? '';
  const initialImageUrl = clubDetail.imageUrl ?? '';
  const hasChanges =
    description !== initialDescription ||
    location !== initialLocation ||
    introduce !== initialIntroduce ||
    imagePreview !== initialImageUrl;

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= DESCRIPTION_MAX_LENGTH) {
      setDescription(value);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (imageFile) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    e.target.value = '';
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleDeleteImage = () => {
    if (imageFile) {
      URL.revokeObjectURL(imagePreview);
    }
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

      updateClubInfo({
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
    { label: '동아리명', value: clubDetail.name },
    { label: '분과', value: clubDetail.categoryName },
  ];

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex flex-1 flex-col gap-6 overflow-auto p-5">
        <section className="flex flex-col items-center gap-3">
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
          {!imagePreview ? (
            <button
              type="button"
              onClick={handleImageClick}
              className="border-indigo-75 hover:bg-indigo-25 flex h-40 w-40 flex-col items-center justify-center gap-2.5 rounded-xl border transition-colors"
            >
              <ImageIcon />
              <p className="text-sub4 text-center whitespace-pre-line text-indigo-100">{'이미지를 \n 추가해주세요'}</p>
            </button>
          ) : (
            <div className="relative h-40 w-40 overflow-hidden rounded-xl">
              <img
                src={imagePreview}
                alt="동아리 로고"
                className="border-indigo-75 h-full w-full rounded-xl border object-cover"
              />
              <button
                type="button"
                onClick={handleDeleteImage}
                className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
              >
                ✕
              </button>
              <button
                type="button"
                onClick={handleImageClick}
                className="absolute right-1 bottom-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
              >
                +
              </button>
            </div>
          )}
        </section>

        {readOnlyFields.map(({ label, value }) => (
          <div key={label} className="flex flex-col gap-1">
            <label className="text-[15px] leading-6 font-medium text-indigo-300">{label}</label>
            <input
              value={value ?? ''}
              disabled
              className="bg-indigo-5 rounded-lg p-2 text-[15px] leading-6 font-semibold disabled:text-indigo-200"
            />
          </div>
        ))}

        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <label className="text-[15px] leading-6 font-medium text-indigo-300">한 줄 소개</label>
            <span className="text-sm text-indigo-200">
              {description.length}/{DESCRIPTION_MAX_LENGTH}
            </span>
          </div>
          <input
            value={description}
            onChange={handleDescriptionChange}
            placeholder="한 줄 소개를 입력해주세요"
            maxLength={DESCRIPTION_MAX_LENGTH}
            className="bg-indigo-5 rounded-lg p-2 text-[15px] leading-6 font-semibold"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[15px] leading-6 font-medium text-indigo-300">동방 위치</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="동방 위치를 입력해주세요"
            className="bg-indigo-5 rounded-lg p-2 text-[15px] leading-6 font-semibold"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[15px] leading-6 font-medium text-indigo-300">상세 소개</label>
          <textarea
            value={introduce}
            onChange={(e) => setIntroduce(e.target.value)}
            placeholder="동아리 상세 소개를 입력해주세요"
            rows={6}
            className="bg-indigo-5 resize-none rounded-lg p-2 text-[15px] leading-6 font-semibold"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 p-3" style={{ marginBottom: 'calc(20px + var(--sab))' }}>
        {uploadError && (
          <p className="text-sm text-red-500">{uploadError.message ?? '이미지 업로드에 실패했습니다.'}</p>
        )}
        {error && <p className="text-sm text-red-500">{error.message ?? '동아리 정보 수정에 실패했습니다.'}</p>}
        <button
          type="button"
          onClick={openSubmitModal}
          disabled={isPending || isUploading || !hasChanges}
          className="bg-primary w-full rounded-lg py-3 text-center text-lg leading-7 font-bold text-white transition-colors disabled:cursor-not-allowed disabled:bg-indigo-300"
        >
          {isUploading ? '이미지 업로드 중...' : isPending ? '수정 중...' : '수정하기'}
        </button>
      </div>

      <BottomModal isOpen={isSubmitModalOpen} onClose={closeSubmitModal}>
        <div className="flex flex-col gap-10 px-8 pt-7 pb-4">
          <div className="text-h3 text-center whitespace-pre-wrap">동아리 정보를 수정하시겠어요?</div>
          <div>
            <button
              onClick={handleSubmit}
              className="bg-primary text-h3 w-full rounded-lg py-3.5 text-center text-white"
            >
              수정하기
            </button>
            <button onClick={closeSubmitModal} className="text-h3 w-full rounded-lg py-3.5 text-center text-indigo-400">
              취소하기
            </button>
          </div>
        </div>
      </BottomModal>
    </div>
  );
}

export default ManagedClubInfo;
