import { useNavigate } from 'react-router-dom';

function NameStep() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 flex-col justify-between px-8 py-5">
      <div className="flex flex-col gap-2">
        <div className="text-[28px] font-extrabold">이름을 입력해주세요</div>
        <div className="font-semibold text-indigo-300">학사정보에 등록된 본명을 입력해주세요.</div>

        <div className="mt-6 flex w-full flex-col gap-2">
          <input type="text" className="border-b-2 border-indigo-400 py-4 text-lg" />
        </div>
      </div>

      <button
        onClick={() => navigate('/signup/finish')}
        className="bg-primary text-indigo-0 mb-8 h-12 items-center rounded-lg font-extrabold"
      >
        다음
      </button>
    </div>
  );
}

export default NameStep;
