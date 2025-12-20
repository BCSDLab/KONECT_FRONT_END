import { Link } from 'react-router-dom';
import type { ClubDetailResponse } from '@/apis/club/entity';
import HumanIcon from '@/assets/svg/human.svg';
import LocationIcon from '@/assets/svg/location.svg';
import Card from '@/components/common/Card';

interface ClubIntroProps {
  clubDetail: ClubDetailResponse;
}

function ClubIntro({ clubDetail }: ClubIntroProps) {
  const isRecruitmentOpen = clubDetail.recruitment.status === 'ONGOING';
  return (
    <>
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
        <div className="text-sm leading-4 font-bold text-indigo-700">동아리 소개</div>
        <div className="mt-1.5 text-xs leading-3.5 text-indigo-300">{clubDetail.introduce}</div>
      </Card>
      <Card>
        <div className="text-sm leading-4 font-bold text-indigo-700">위치 및 회원 수</div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <HumanIcon />
            <div className="flex flex-col gap-1">
              <div className="text-[10px] leading-3 font-medium text-indigo-300">회원수</div>
              <div className="text-sm leading-3.5 font-semibold text-indigo-700">{clubDetail.memberCount}명</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LocationIcon />
            <div className="flex flex-col gap-1">
              <div className="text-[10px] leading-3 font-medium text-indigo-300">동아리방 위치</div>
              <div className="text-sm leading-3.5 font-semibold text-indigo-700">{clubDetail.location}</div>
            </div>
          </div>
        </div>
      </Card>
      <Card className="gap-1.5">
        <div className="text-sm leading-4 font-bold text-indigo-700">대표 연락처</div>
        <div className="bg-indigo-5 h-px"></div>
        <div className="flex flex-col gap-1 text-xs leading-3.5 font-medium text-indigo-300">
          <div className="text-sm leading-4 text-indigo-700">{clubDetail.representatives[0].name}</div>
          <div>{clubDetail.representatives[0].phone}</div>
          <div>{clubDetail.representatives[0].email}</div>
        </div>
      </Card>
    </>
  );
}

export default ClubIntro;
