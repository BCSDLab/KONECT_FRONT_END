import { useNavigate } from 'react-router-dom';

function StudentIdStep() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 flex-col justify-between px-8 py-5">
      <div className="flex flex-col gap-2">
        <div className="text-[28px] font-extrabold">학번을 입력해주세요</div>
        <div className="text-sm font-semibold text-indigo-300">원활한 서비스 이용을 위해 학번을 입력해주세요</div>

        <div className="mt-6 flex w-full flex-col gap-2">
          <input type="text" className="border-b-2 border-indigo-400 py-4 text-lg" />
        </div>
      </div>

      <button
        onClick={() => navigate('/signup/profile/name')}
        className="bg-primary text-indigo-0 mb-8 h-12 items-center rounded-lg font-extrabold"
      >
        다음
      </button>
    </div>
  );
}

export default StudentIdStep;
