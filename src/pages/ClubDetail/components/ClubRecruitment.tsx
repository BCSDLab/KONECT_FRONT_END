import { Link } from 'react-router-dom';
import type { ClubDetailResponse } from '@/apis/club/entity';
import Card from '@/components/common/Card';

interface ClubRecruitProps {
  clubDetail: ClubDetailResponse;
}

function ClubRecruitment({ clubDetail }: ClubRecruitProps) {
  const isRecruitmentOpen = clubDetail.recruitment.status === 'ONGOING';
  return (
    <div className="flex flex-col gap-2">
      <Card>
        <div>
          <div className="text-sm leading-4 font-bold text-indigo-700">신입 회원 모집</div>
          <div className="mt-1.5 text-xs leading-3.5 text-indigo-300">
            모집 기간 : {clubDetail.recruitment.startDate} ~ {clubDetail.recruitment.endDate}
          </div>
        </div>
        {isRecruitmentOpen ? (
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
            지원하기
          </span>
        )}
      </Card>
      <Card>
        <div className="text-sm leading-4 font-bold text-indigo-700">모집 공고</div>
      </Card>
    </div>
  );
}

export default ClubRecruitment;
