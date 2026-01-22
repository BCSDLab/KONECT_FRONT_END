import { Link } from 'react-router-dom';
import Card from '@/components/common/Card';
import useGetClubRecruitment from '../hooks/useGetClubRecruitment';

interface ClubRecruitProps {
  clubId: number;
}

function ClubRecruitment({ clubId }: ClubRecruitProps) {
  const { data: clubRecruitment } = useGetClubRecruitment(clubId);
  const isRecruitmentOpen = clubRecruitment.status === 'ONGOING';
  const canApply = isRecruitmentOpen && !clubRecruitment.isApplied;

  const getButtonContent = () => {
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
            {clubRecruitment.startDate && clubRecruitment.endDate
              ? `${clubRecruitment.startDate} ~ ${clubRecruitment.endDate}`
              : '상세 모집'}
          </div>
        </div>
        {canApply ? (
          <Link
            to="applications"
            className="bg-primary w-full rounded-sm py-3 text-center text-xs leading-3 font-medium text-white"
          >
            지원서 작성하기
          </Link>
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
          {clubRecruitment.content.replace(/\\n/g, '\n')}
        </div>
        {clubRecruitment.images.length > 0 && (
          <div className="mt-2 flex flex-col gap-2">
            {clubRecruitment.images.map((image, index) => (
              <img key={index} src={image.url} alt={`모집 공고 이미지 ${index + 1}`} className="w-full rounded-sm" />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

export default ClubRecruitment;
