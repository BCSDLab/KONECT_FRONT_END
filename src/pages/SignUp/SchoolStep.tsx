import { useNavigate } from 'react-router-dom';
import RightArrowIcon from '@/assets/svg/chevron-right.svg';
import Card from '@/components/common/Card';

function SchoolStep() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-1 flex-col justify-between px-8 py-5">
      <div className="flex flex-col gap-2">
        <div className="text-[28px] font-extrabold">학교를 선택해주세요</div>
        <div className="font-semibold text-indigo-300">소속 학교를 알려주세요</div>

        <div className="mt-7 flex w-full flex-col gap-2">
          <Card
            onClick={() => navigate('/signup/profile/student-id')}
            className="border-indigo-75 flex flex-row items-center justify-between"
          >
            <div>한국기술교육대학교</div>
            <RightArrowIcon />
          </Card>
          <Card className="border-indigo-75 flex flex-row items-center justify-between">
            <div>한국기술교육대학교</div>
            <RightArrowIcon />
          </Card>
          <Card className="border-indigo-75 flex flex-row items-center justify-between">
            <div>한국기술교육대학교</div>
            <RightArrowIcon />
          </Card>
          <Card className="border-indigo-75 flex flex-row items-center justify-between">
            <div>한국기술교육대학교</div>
            <RightArrowIcon />
          </Card>
          <Card className="border-indigo-75 flex flex-row items-center justify-between">
            <div>한국기술교육대학교</div>
            <RightArrowIcon />
          </Card>
        </div>
      </div>

      {/* <button className="bg-primary text-indigo-0 mb-8 h-12 items-center rounded-lg font-extrabold">다음</button> */}
    </div>
  );
}

export default SchoolStep;
