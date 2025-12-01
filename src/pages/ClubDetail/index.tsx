import { Link } from 'react-router-dom';
import Card from '@/components/common/Card';

function ClubDetail() {
  return (
    <>
      <div className="bg-white p-5 shadow-[0_1px_2px_0_rgba(0,0,0,0.04)]">
        <div className="mb-4 flex items-start gap-4">
          <img
            className="border-indigo-5 h-16 w-16 rounded-sm border"
            src="https://placehold.co/64x64"
            alt="동아리 이미지"
          />
          <div>
            <div className="mb-2 text-xl leading-5.5 font-black">KORA</div>
            <div className="mb-1 text-[10px] leading-3">예체능분과</div>
            <div className="text-sm leading-3.5">운동을 좋아하는 사람들의 모임</div>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="bg-indigo-5 flex flex-1 flex-col gap-1.5 rounded-sm p-3">
            <div className="text-[10px] leading-2">회원수</div>
            <div className="text-xs font-bold">120명</div>
          </div>
          <div className="bg-indigo-5 flex flex-1 flex-col gap-1.5 rounded-sm p-3">
            <div className="text-[10px] leading-2">동방 위치</div>
            <div className="text-xs font-bold">407호</div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 p-3">
        <Card>
          <div>
            <div className="text-sm leading-4 font-bold text-indigo-700">신입 회원 모집</div>
            <div className="mt-1.5 text-xs leading-3.5 text-indigo-300">모집 기간 : 2025.11.20 ~ 2025.12.24</div>
          </div>
          <Link to="/clubs" className="bg-primary w-full rounded-sm py-3 text-center text-xs font-medium text-white">
            지원하기
          </Link>
        </Card>
        <Card>
          <div className="text-sm leading-4 font-bold text-indigo-700">동아리 소개</div>
          <div className="mt-1.5 text-xs leading-3.5 text-indigo-300">
            KORA는 한국기술교육대학교의 로봇 및 AI 연구 동아리입니다. 매주 정기 스터디를 통해 로봇공학, 머신러닝, 딥러닝
            등을 학습하고, 팀 프로젝트로 실제 로봇을 제작합니다. 선후배 간의 활발한 기술 교류를 통해 함께 성장하는
            동아리 입니다.
          </div>
        </Card>
        <Card className="gap-1.5">
          <div className="text-sm leading-4 font-bold text-indigo-700">대표 연락처</div>
          <div className="bg-indigo-5 h-px"></div>
          <div className="flex flex-col gap-1 text-xs leading-3.5 text-indigo-300">
            <div className="text-sm leading-4 text-indigo-700">정해성</div>
            <div>010-1234-5750</div>
            <div>president@kore.com</div>
          </div>
        </Card>
      </div>
    </>
  );
}

export default ClubDetail;
