import { useEffect, useRef, useState, type ChangeEvent, type SubmitEventHandler } from 'react';
import { getApiErrorMessage } from '@konect/utils/api-error-message';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { clubRegistrationMutations } from '@/apis/clubRegistration/mutations';
import { CLUB_CATEGORY, type ClubCategory } from '@/apis/common/club';
import type { University } from '@/apis/home/entity';
import { uploadImage } from '@/apis/upload';
import {
  ClubRequestFormLayout,
  FieldGroup,
  MAX_CLUB_NAME_LENGTH,
  MAX_FULL_INTRODUCTION_LENGTH,
  MAX_MEDIA_COUNT,
  MAX_SHORT_DESCRIPTION_LENGTH,
  MediaUploader,
  PlainTextInput,
  RequestHeader,
  TextInputWithCount,
  UniversityCombobox,
  type LocalMediaItem,
} from '@/pages/ClubRequest/components';
import { createLocalMediaItem, getUniversityLabel } from '@/pages/ClubRequest/utils';

const ACCEPTED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/gif']);

const CLUB_CATEGORY_OPTIONS: { label: string; value: ClubCategory }[] = [
  { label: '학술', value: CLUB_CATEGORY.ACADEMIC },
  { label: '운동', value: CLUB_CATEGORY.SPORTS },
  { label: '취미', value: CLUB_CATEGORY.HOBBY },
  { label: '종교', value: CLUB_CATEGORY.RELIGION },
  { label: '공연', value: CLUB_CATEGORY.PERFORMANCE },
  { label: '봉사', value: CLUB_CATEGORY.SOCIAL_SERVICE },
  { label: '전시/창작', value: CLUB_CATEGORY.EXHIBITION_CREATION },
  { label: '기타', value: CLUB_CATEGORY.ETC },
  { label: '주니어', value: CLUB_CATEGORY.JUNIOR },
];

function ClubRegistration() {
  const navigate = useNavigate();
  const [universityInput, setUniversityInput] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [clubName, setClubName] = useState('');
  const [clubEmoji, setClubEmoji] = useState('🏀');
  const [clubCategory, setClubCategory] = useState<ClubCategory | ''>('');
  const [clubTopic, setClubTopic] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullIntroduction, setFullIntroduction] = useState('');
  const [mediaItems, setMediaItems] = useState<LocalMediaItem[]>([]);
  const [mediaError, setMediaError] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const mediaItemsRef = useRef<LocalMediaItem[]>([]);

  const { mutateAsync: submitRegistrationRequest, isPending } = useMutation(clubRegistrationMutations.submit());
  const isSubmitting = isPending || isUploading;
  const isFormValid = Boolean(
    selectedUniversity &&
      clubName.trim() &&
      clubEmoji.trim() &&
      clubCategory &&
      clubTopic.trim() &&
      shortDescription.trim() &&
      fullIntroduction.trim()
  );

  useEffect(() => {
    mediaItemsRef.current = mediaItems;
  }, [mediaItems]);

  useEffect(() => {
    return () => {
      mediaItemsRef.current.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, []);

  const handleAppendMediaItems = (files: File[]) => {
    setMediaError('');

    const validFiles = files.filter((file) => ACCEPTED_IMAGE_TYPES.has(file.type));
    if (validFiles.length < files.length) {
      setMediaError('JPG, PNG, GIF 형식의 이미지만 첨부할 수 있습니다.');
    }

    setMediaItems((prevItems) => {
      const remainingCount = MAX_MEDIA_COUNT - prevItems.length;
      if (remainingCount <= 0) {
        setMediaError(`사진은 최대 ${MAX_MEDIA_COUNT}개까지 첨부할 수 있습니다.`);
        return prevItems;
      }

      if (validFiles.length > remainingCount) {
        setMediaError(`사진은 최대 ${MAX_MEDIA_COUNT}개까지 첨부할 수 있습니다.`);
      }

      return [...prevItems, ...validFiles.slice(0, remainingCount).map(createLocalMediaItem)];
    });
  };

  const handleClearMediaItems = () => {
    setMediaItems((prevItems) => {
      prevItems.forEach((item) => URL.revokeObjectURL(item.previewUrl));
      return [];
    });
    setMediaError('');
  };

  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setClubCategory(event.target.value as ClubCategory | '');
  };

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setFormMessage('');

    if (!selectedUniversity || !clubCategory) {
      setFormMessage('필수 정보를 모두 입력해주세요.');
      return;
    }

    try {
      setIsUploading(true);
      const uploadedImages = await Promise.all(mediaItems.map((item) => uploadImage(item.file, 'CLUB')));
      setIsUploading(false);

      await submitRegistrationRequest({
        body: {
          universityName: getUniversityLabel(selectedUniversity),
          clubName: clubName.trim(),
          clubCategory,
          clubTopic: clubTopic.trim(),
          clubEmoji: clubEmoji.trim(),
          shortDescription: shortDescription.trim(),
          fullIntroduction: fullIntroduction.trim(),
          imageUrls: uploadedImages.map(({ fileUrl }) => fileUrl),
        },
      });

      handleClearMediaItems();
      setClubName('');
      setClubEmoji('🏀');
      setClubCategory('');
      setClubTopic('');
      setShortDescription('');
      setFullIntroduction('');
      navigate('/clubs/register/complete');
    } catch (error) {
      setIsUploading(false);
      setFormMessage(getApiErrorMessage(error, '신규 동아리 등록 요청에 실패했습니다.'));
    }
  };

  return (
    <main className="min-h-screen px-5 py-10 text-black md:py-12.5">
      <div className="mx-auto flex w-full max-w-254 flex-col items-center gap-10">
        <RequestHeader
          title="신규 동아리 정보를 등록해주세요"
          description="입력하신 내용은 확인 후 동아리 페이지에 등록돼요."
        />

        <ClubRequestFormLayout
          formMessage={formMessage}
          isSubmitDisabled={!isFormValid || isSubmitting}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
        >
          <FieldGroup label="대학교명" required>
            <UniversityCombobox
              inputValue={universityInput}
              selectedUniversity={selectedUniversity}
              onInputChange={(value) => {
                setUniversityInput(value);
                setSelectedUniversity(null);
              }}
              onSelect={(university, universityLabel) => {
                setSelectedUniversity(university);
                setUniversityInput(universityLabel);
                setFormMessage('');
              }}
            />
          </FieldGroup>

          <FieldGroup label="동아리명" required>
            <TextInputWithCount
              value={clubName}
              onChange={(event) => setClubName(event.target.value)}
              placeholder="(필수) 동아리명을 입력해주세요."
              maxLength={MAX_CLUB_NAME_LENGTH}
              ariaLabel="동아리명"
            />
          </FieldGroup>

          <div className="grid gap-5 lg:grid-cols-[221px_minmax(0,367px)_minmax(0,1fr)]">
            <FieldGroup label="동아리 이모지" required>
              <div className="border-text-100 focus-within:border-primary-500 flex h-33 items-center justify-center rounded-[20px] border bg-white transition-colors">
                <input
                  className="text-text-900 h-full w-full bg-transparent text-center text-[48px] outline-none"
                  value={clubEmoji}
                  onChange={(event) => setClubEmoji(event.target.value)}
                  maxLength={8}
                  aria-label="동아리 이모지"
                />
              </div>
            </FieldGroup>

            <FieldGroup label="동아리 분과" required>
              <div className="border-text-100 focus-within:border-primary-500 relative flex h-15.25 items-center rounded-[20px] border bg-white transition-colors">
                <select
                  className="placeholder:text-text-400 text-text-500 h-full w-full appearance-none bg-transparent px-5 text-[16px] leading-8 font-medium outline-none sm:px-7.5 sm:text-[20px] sm:leading-10"
                  value={clubCategory}
                  onChange={handleCategoryChange}
                  aria-label="동아리 분과"
                >
                  <option value="">(필수) 동아리 분과를 선택해주세요.</option>
                  {CLUB_CATEGORY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </FieldGroup>

            <FieldGroup label="동아리 주제" required>
              <PlainTextInput
                value={clubTopic}
                onChange={(event) => setClubTopic(event.target.value)}
                placeholder="(필수) ex) 농구, 밴드, 사진, 댄스"
                ariaLabel="동아리 주제"
                maxLength={20}
              />
            </FieldGroup>
          </div>

          <FieldGroup
            label="한 줄 소개"
            required
            helperText="동아리를 설명할 수 있는 내용을 한 줄 이내로 작성해주세요."
          >
            <TextInputWithCount
              value={shortDescription}
              onChange={(event) => setShortDescription(event.target.value)}
              placeholder="(필수) 동아리의 한 줄 소개를 입력해주세요."
              maxLength={MAX_SHORT_DESCRIPTION_LENGTH}
              ariaLabel="한 줄 소개"
            />
          </FieldGroup>

          <MediaUploader
            mediaError={mediaError}
            mediaItems={mediaItems}
            onAppendMediaFiles={handleAppendMediaItems}
            onClearMediaItems={handleClearMediaItems}
          />

          <FieldGroup label="동아리 소개" required>
            <TextInputWithCount
              value={fullIntroduction}
              onChange={(event) => setFullIntroduction(event.target.value)}
              placeholder="(필수) 동아리를 소개할 수 있는 내용을 자유롭게 작성해주세요."
              maxLength={MAX_FULL_INTRODUCTION_LENGTH}
              ariaLabel="동아리 소개"
            />
          </FieldGroup>
        </ClubRequestFormLayout>
      </div>
    </main>
  );
}

export default ClubRegistration;
