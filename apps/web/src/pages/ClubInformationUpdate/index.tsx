import { useEffect, useMemo, useRef, useState, type SubmitEventHandler } from 'react';
import { getApiErrorMessage } from '@konect/utils/api-error-message';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { clubInformationUpdateMutations } from '@/apis/clubInformationUpdate/mutations';
import type { ClubCategory } from '@/apis/common/club';
import type { University } from '@/apis/home/entity';
import { universityClubQueries } from '@/apis/universityClub/queries';
import { uploadImage } from '@/apis/upload';
import {
  ClubRequestFormLayout,
  FieldGroup,
  MAX_CLUB_NAME_LENGTH,
  MAX_FULL_INTRODUCTION_LENGTH,
  MAX_MEDIA_COUNT,
  MAX_SHORT_DESCRIPTION_LENGTH,
  MediaUploader,
  RequestHeader,
  TextInputWithCount,
  UniversityCombobox,
  type LocalMediaItem,
} from '@/pages/ClubRequest/components';
import { createLocalMediaItem, getUniversityLabel } from '@/pages/ClubRequest/utils';

const ACCEPTED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/gif']);

const CLUB_CATEGORY_EMOJI: Record<ClubCategory, string> = {
  ACADEMIC: '📚',
  SPORTS: '⚽',
  HOBBY: '🎨',
  RELIGION: '🙏',
  PERFORMANCE: '🎭',
  SOCIAL_SERVICE: '🤝',
  EXHIBITION_CREATION: '🖼️',
  ETC: '🏫',
  JUNIOR: '🌱',
};

function ClubInformationUpdate() {
  const navigate = useNavigate();
  const [universityInput, setUniversityInput] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [clubName, setClubName] = useState('');
  const [clubQuery, setClubQuery] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullIntroduction, setFullIntroduction] = useState('');
  const [mediaItems, setMediaItems] = useState<LocalMediaItem[]>([]);
  const [mediaError, setMediaError] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const mediaItemsRef = useRef<LocalMediaItem[]>([]);

  const selectedUniversityId = selectedUniversity?.id;
  const { data: clubListData, isFetching: isFetchingClubs } = useQuery({
    ...universityClubQueries.list(selectedUniversityId ?? 0, { limit: 20, query: clubQuery }),
    enabled: Boolean(selectedUniversityId && clubQuery),
  });

  const matchedClub = useMemo(() => {
    const normalizedClubName = clubName.trim();
    if (!normalizedClubName) return undefined;

    return clubListData?.clubs.find((club) => club.name.trim() === normalizedClubName);
  }, [clubListData?.clubs, clubName]);

  const { mutateAsync: submitUpdateRequest, isPending } = useMutation(clubInformationUpdateMutations.submit());
  const isSubmitting = isPending || isUploading;
  const isFormValid = Boolean(
    selectedUniversity && clubName.trim() && shortDescription.trim() && fullIntroduction.trim()
  );

  useEffect(() => {
    mediaItemsRef.current = mediaItems;
  }, [mediaItems]);

  useEffect(() => {
    return () => {
      mediaItemsRef.current.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, []);

  const handleUniversityInputChange = (value: string) => {
    setUniversityInput(value);
    setSelectedUniversity(null);
  };

  const handleUniversitySelect = (university: University, universityLabel: string) => {
    setSelectedUniversity(university);
    setUniversityInput(universityLabel);
    setClubName('');
    setClubQuery('');
    setFormMessage('');
  };

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

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    setFormMessage('');

    if (!selectedUniversity) {
      setFormMessage('대학교를 선택해주세요.');
      return;
    }

    if (!matchedClub) {
      setFormMessage(
        isFetchingClubs
          ? '동아리 정보를 확인 중입니다. 잠시 후 다시 시도해주세요.'
          : '선택한 학교에 등록된 동아리명을 정확히 입력해주세요.'
      );
      return;
    }

    try {
      setIsUploading(true);
      const uploadedImages = await Promise.all(mediaItems.map((item) => uploadImage(item.file, 'CLUB')));
      setIsUploading(false);

      await submitUpdateRequest({
        clubId: matchedClub.id,
        body: {
          universityName: getUniversityLabel(selectedUniversity),
          clubName: clubName.trim(),
          clubCategory: matchedClub.category,
          clubTopic: matchedClub.topic,
          clubEmoji: CLUB_CATEGORY_EMOJI[matchedClub.category],
          shortDescription: shortDescription.trim(),
          fullIntroduction: fullIntroduction.trim(),
          imageUrls: uploadedImages.map(({ fileUrl }) => fileUrl),
        },
      });

      handleClearMediaItems();
      setClubName('');
      setClubQuery('');
      setShortDescription('');
      setFullIntroduction('');
      navigate('/clubs/register/complete');
    } catch (error) {
      setIsUploading(false);
      setFormMessage(getApiErrorMessage(error, '동아리 정보 수정 요청에 실패했습니다.'));
    }
  };

  return (
    <main className="min-h-screen px-5 py-10 text-black md:py-12.5">
      <div className="mx-auto flex w-full max-w-254 flex-col items-center gap-10">
        <RequestHeader
          title="동아리 소개 내용을 보내주세요!"
          description="입력하신 내용은 확인 후 동아리 상세 페이지에 등록돼요."
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
              onInputChange={handleUniversityInputChange}
              onSelect={handleUniversitySelect}
            />
          </FieldGroup>

          <FieldGroup label="동아리명" required>
            <TextInputWithCount
              value={clubName}
              onChange={(event) => {
                const value = event.target.value;
                setClubName(value);
                setClubQuery(value.trim());
                setFormMessage('');
              }}
              placeholder="(필수) 동아리명을 입력해주세요."
              maxLength={MAX_CLUB_NAME_LENGTH}
              ariaLabel="동아리명"
            />
          </FieldGroup>

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

export default ClubInformationUpdate;
