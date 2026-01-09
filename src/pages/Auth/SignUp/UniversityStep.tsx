import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RightArrowIcon from '@/assets/svg/chevron-right.svg';
import Card from '@/components/common/Card';
import { useSignupStore } from '@/stores/signupStore';
import StepLayout from './components/StepLayout';
import { useGetUniversityList } from './hooks/useUniversity';

function UniversityCard({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Card onClick={onClick} className="border-indigo-75 flex w-full flex-row items-center justify-between">
      <div>{label}</div>
      <RightArrowIcon />
    </Card>
  );
}

function UniversityStep() {
  const navigate = useNavigate();

  const [universityName, setUniversityName] = useState('');

  const update = useSignupStore((state) => state.update);
  const { data: universityList } = useGetUniversityList();

  const trimmed = universityName.trim();
  const filteredUniversities = !trimmed
    ? (universityList?.universities ?? [])
    : (universityList?.universities.filter((university) => university.name.includes(trimmed)) ?? []);

  const handleUniversitySelect = (universityId: string, universityName: string) => () => {
    update({ universityId, universityName });
    navigate('/signup/studentid');
  };

  return (
    <StepLayout title="학교를 검색해주세요" description={`정확한 답변을 하지 않으면\n불이익이 발생할 수 있습니다.`}>
      <input
        type="text"
        value={universityName}
        placeholder="학교를 입력해주세요.."
        onChange={(e) => setUniversityName(e.target.value)}
        className="mt-5 w-full border-b-2 border-indigo-400 py-4 text-[20px] font-bold text-indigo-300 placeholder:text-indigo-300"
      />
      <div className="mt-7 flex flex-col gap-2">
        {filteredUniversities.map((university) => (
          <UniversityCard
            key={university.id}
            label={university.name}
            onClick={handleUniversitySelect(university.id, university.name)}
          />
        ))}
      </div>
    </StepLayout>
  );
}

export default UniversityStep;
