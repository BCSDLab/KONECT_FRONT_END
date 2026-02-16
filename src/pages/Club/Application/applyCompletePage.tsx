import { useNavigate, useParams } from 'react-router-dom';
import CheckCircleIcon from '@/assets/svg/check-circle.svg';
import { useClubApplicationStore } from '@/stores/clubApplicationStore';
import { useGetClubDetail } from '../ClubDetail/hooks/useGetClubDetail';

function ApplyCompletePage() {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const { data: clubDetail } = useGetClubDetail(Number(clubId));
  const clearApplication = useClubApplicationStore((s) => s.clearApplication);

  const handleGoToClubDetail = () => {
    clearApplication();
    navigate(`/clubs/${clubId}`, { replace: true });
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col items-center px-3 pt-30 pb-10">
      <CheckCircleIcon className="mb-8" />
      <div className="text-center text-2xl leading-6.5 font-bold text-indigo-700">가입 신청 완료!</div>
      <div className="mt-5 text-center leading-4.5 text-indigo-300">
        <div>{clubDetail.name} 동아리에 가입 신청이 완료되었어요</div>
        <div>운영진 승인 후 가입이 완료될 예정이에요</div>
      </div>

      <button
        type="button"
        className="bg-primary mx-6 mt-auto w-full rounded-lg py-3.5 text-center text-lg leading-7 font-bold text-white"
        onClick={handleGoToClubDetail}
      >
        완료하기
      </button>
    </div>
  );
}

export default ApplyCompletePage;
