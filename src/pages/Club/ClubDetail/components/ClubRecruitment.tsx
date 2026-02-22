import { Link, useNavigate } from 'react-router-dom';
import BottomModal from '@/components/common/BottomModal';
import Card from '@/components/common/Card';
import LinkifiedText from '@/components/common/LinkifiedText';
import { useClubApplicationStore } from '@/stores/clubApplicationStore';
import useBooleanState from '@/utils/hooks/useBooleanState';
import useClubApply from '../../Application/hooks/useClubApply';
import useGetClubRecruitment from '../hooks/useGetClubRecruitment';

interface ClubRecruitProps {
  clubId: number;
  isMember: boolean;
}

function ClubRecruitment({ clubId, isMember }: ClubRecruitProps) {
  const navigate = useNavigate();
  const { data: clubRecruitment } = useGetClubRecruitment(clubId);
  const { hasQuestions, applyDirectly, isFeeRequired, isPending } = useClubApply(clubId);
  const { value: isConfirmOpen, setTrue: openConfirm, setFalse: closeConfirm } = useBooleanState();

  const setApplication = useClubApplicationStore((s) => s.setApplication);
  const isRecruitmentOpen = clubRecruitment.status === 'ONGOING';
  const canApply = isRecruitmentOpen && !clubRecruitment.isApplied && !isMember;
  const recruitmentContent = clubRecruitment.content.replace(/\\n/g, '\n');

  const handleApply = () => {
    if (isFeeRequired) {
      setApplication(clubId, []);
      navigate(`/clubs/${clubId}/fee`);
    } else {
      applyDirectly();
    }
  };

  const getButtonContent = () => {
    if (isMember) return '가입 완료';
    if (clubRecruitment.isApplied) return '가입 신청 완료';
    if (!isRecruitmentOpen) return '모집 기간이 아닙니다';
    return '지원서 작성하기';
  };

  return (
    <div className="flex flex-col gap-2">
      <Card>
        <div>
          <div className="text-sm leading-4 font-bold text-indigo-700">신입 회원 모집</div>
          <div className="mt-1.5 text-xs leading-3.5 text-indigo-300">
            모집 기간 :{' '}
            {clubRecruitment.startAt && clubRecruitment.endAt
              ? `${clubRecruitment.startAt} ~ ${clubRecruitment.endAt}`
              : '상시 모집'}
          </div>
        </div>
        {canApply ? (
          hasQuestions ? (
            <Link
              to="applications"
              className="bg-primary w-full rounded-sm py-3 text-center text-xs leading-3 font-medium text-white"
            >
              지원하기
            </Link>
          ) : (
            <button
              type="button"
              onClick={openConfirm}
              className="bg-primary w-full rounded-sm py-3 text-center text-xs leading-3 font-medium text-white"
            >
              지원하기
            </button>
          )
        ) : (
          <span
            className="w-full cursor-not-allowed rounded-sm bg-gray-300 py-3 text-center text-xs leading-3 font-medium text-gray-500"
            aria-disabled="true"
          >
            {getButtonContent()}
          </span>
        )}
      </Card>
      <Card>
        <div className="text-sm leading-4 font-bold text-indigo-700">모집 공고</div>
        <div className="text-xs leading-3.5 whitespace-pre-wrap text-indigo-300">
          <LinkifiedText text={recruitmentContent} />
        </div>
        {clubRecruitment.images.length > 0 && (
          <div className="mt-2 flex flex-col gap-2">
            {clubRecruitment.images.map((image, index) => (
              <img key={index} src={image.url} alt={`모집 공고 이미지 ${index + 1}`} className="w-full rounded-sm" />
            ))}
          </div>
        )}
      </Card>
      <BottomModal isOpen={isConfirmOpen} onClose={closeConfirm}>
        <div className="flex flex-col gap-10 px-8 pt-7 pb-4">
          <div className="text-h3 text-center whitespace-pre-wrap">동아리에 지원하시겠어요?</div>
          <div>
            <button
              type="button"
              onClick={handleApply}
              disabled={isPending}
              className="bg-primary text-h3 w-full rounded-lg py-3.5 text-center text-white disabled:opacity-50"
            >
              지원하기
            </button>
            <button
              type="button"
              onClick={closeConfirm}
              className="text-h3 w-full rounded-lg py-3.5 text-center text-indigo-400"
            >
              취소
            </button>
          </div>
        </div>
      </BottomModal>
    </div>
  );
}

export default ClubRecruitment;
