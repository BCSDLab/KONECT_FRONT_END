import { useNavigate } from 'react-router-dom';
import CheckInCircleIcon from '@/assets/svg/check-in-circle.svg';
import { useMyInfo } from '@/pages/User/Profile/hooks/useMyInfo';
import { useAuthStore } from '@/stores/authStore';

function FinishStep() {
  const navigate = useNavigate();
  const { myInfo } = useMyInfo();
  const setUser = useAuthStore((state) => state.setUser);

  const handleStart = () => {
    if (!myInfo) {
      return;
    }

    setUser(myInfo);
    navigate('/home');
  };

  return (
    <div className="flex flex-1 flex-col justify-between px-8 py-5">
      <div className="flex flex-col items-center text-center">
        <CheckInCircleIcon className="mt-15" />

        <div className="mt-8 text-2xl font-extrabold">환영합니다!</div>

        <div>
          <div className="font-extrabold">{myInfo.name}님</div>
          <div className="mt-1 text-xs text-indigo-300">
            <div>KONECT 가입이 완료되었습니다.</div>
            <div>동아리 활동을 시작해보세요!</div>
          </div>
        </div>
      </div>

      <button
        onClick={handleStart}
        className="bg-primary text-indigo-0 mb-8 h-12 w-full items-center rounded-lg font-extrabold"
      >
        시작하기
      </button>
    </div>
  );
}

export default FinishStep;
