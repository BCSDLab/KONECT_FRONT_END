import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RightArrowIcon from '@/assets/svg/chevron-right.svg';
import Card from '@/components/common/Card';
import { useSignupStore } from '@/stores/signupStore';
import useBooleanState from '@/utils/hooks/useBooleanState';
import StepLayout from './components/StepLayout';

const schools = ['한국기술교육대학교', '단국대학교 (천안)', '충북대학교', '충남대학교'];

function SchoolCard({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Card onClick={onClick} className="border-indigo-75 flex w-full flex-row items-center justify-between">
      <div>{label}</div>
      <RightArrowIcon />
    </Card>
  );
}

function SchoolStep() {
  const navigate = useNavigate();
  const update = useSignupStore((state) => state.update);
  const self = useBooleanState(false);
  const [customSchool, setCustomSchool] = useState('');

  const handleSchoolSelect = (school: string) => () => {
    update({ school });
    navigate('/signup/profile/student-id');
  };

  const handleCustomSchoolNext = () => {
    update({ school: customSchool });
    navigate('/signup/profile/student-id');
  };

  if (self.value) {
    return (
      <StepLayout
        title="학교를 입력해주세요"
        description={`정확한 답변을 하지 않으면\n불이익이 발생할 수 있습니다.`}
        onNext={handleCustomSchoolNext}
        nextDisabled={!customSchool.trim()}
      >
        <input
          type="text"
          value={customSchool}
          onChange={(e) => setCustomSchool(e.target.value)}
          className="mt-5 w-full border-b-2 border-indigo-400 py-4 text-[20px] font-bold text-indigo-300"
        />
      </StepLayout>
    );
  }

  return (
    <StepLayout title="학교를 선택해주세요" description="동아리를 찾기 위해서 학교를 선택해주세요">
      <div className="mt-7 flex flex-col gap-2">
        {schools.map((school) => (
          <SchoolCard key={school} label={school} onClick={handleSchoolSelect(school)} />
        ))}
        <SchoolCard label="직접 입력하기" onClick={self.setTrue} />
      </div>
    </StepLayout>
  );
}

export default SchoolStep;
