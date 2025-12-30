import { useNavigate, useParams } from 'react-router-dom';
import WarningCircleIcon from '@/assets/svg/warning-circle.svg';
import Card from '@/components/common/Card';
import AccountInfoCard from './components/AccountInfo';
import { useGetClubFee } from './hooks/useGetClubFee';

function ClubFeePage() {
  const navigate = useNavigate();
  const { clubId } = useParams();
  const { data: clubFee } = useGetClubFee(Number(clubId));

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2 px-3 pt-3 pb-10">
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
          <div className="text-primary text-lg leading-5 font-extrabold">{clubFee.amount?.toLocaleString()}원</div>
        </Card>
        <div className="text-[10px] leading-3 font-medium text-indigo-300">납부 기한 : {clubFee.deadLine}</div>
      </Card>

      <AccountInfoCard accountInfo={clubFee} />
      <button
        type="button"
        className="bg-primary mt-auto w-full rounded-lg py-3.5 text-center text-lg leading-7 font-bold text-white"
        onClick={() => navigate(`/clubs/${clubId}/complete`)}
      >
        제출하기
      </button>
    </div>
  );
}

export default ClubFeePage;
