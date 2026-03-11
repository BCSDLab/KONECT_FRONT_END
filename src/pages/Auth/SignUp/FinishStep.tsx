import { useNavigate } from 'react-router-dom';
import { useMyInfo } from '@/pages/User/Profile/hooks/useMyInfo';
import { useAuthStore } from '@/stores/authStore';

function FinishStep() {
  const navigate = useNavigate();
  const { myInfo } = useMyInfo();
  const setUser = useAuthStore((state) => state.setUser);

  if (!myInfo) {
    return null;
  }

  const handleStart = () => {
    if (!myInfo) {
      return;
    }

    setUser(myInfo);
    navigate('/guide');
  };

  return (
    <div
      className="flex min-h-full flex-1 flex-col justify-between px-8 pt-[72px]"
      style={{ paddingBottom: 'calc(32px + var(--sab))' }}
    >
      <div className="flex flex-col items-center gap-8 text-center">
        <div className="bg-primary-500 flex size-[100px] items-center justify-center rounded-full">
          <svg
            aria-hidden="true"
            viewBox="5.5 8 18.5 13"
            className="text-indigo-0 h-[34px] w-[50px]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.20001 14.3998L12.2912 19.491L22.4724 9.30859"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="text-d2 text-indigo-700">환영합니다!</div>
          <div className="text-h1 text-indigo-700">{myInfo.name}님,</div>
          <div className="text-h5 text-indigo-300">
            <p>KONECT 가입이 완료되었습니다.</p>
            <p>동아리 활동을 시작해보세요!</p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleStart}
        className="bg-primary-500 text-sub1 text-indigo-0 h-12 w-full rounded-lg font-bold"
      >
        시작하기
      </button>
    </div>
  );
}

export default FinishStep;
