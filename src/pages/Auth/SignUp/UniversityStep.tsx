import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RightArrowIcon from '@/assets/svg/chevron-right.svg';
import Card from '@/components/common/Card';
import { KAKAO_OPEN_CHAT_URL } from '@/constants/links';
import { useSignupStore } from '@/stores/signupStore';
import StepLayout from './components/StepLayout';
import { useGetUniversityList } from './hooks/useUniversity';

function UniversityCard({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Card onClick={onClick} className="border-indigo-75 flex w-full flex-row items-center justify-between">
      <div className="text-sub2">{label}</div>
      <RightArrowIcon />
    </Card>
  );
}

function UniversityStep() {
  const navigate = useNavigate();

  const { data: universityList } = useGetUniversityList();

  const update = useSignupStore((state) => state.update);
  const [universityName, setUniversityName] = useState('');

  const trimmed = universityName.trim();
  const filteredUniversities = !trimmed
    ? (universityList?.universities ?? [])
    : (universityList?.universities.filter((university) => university.name.includes(trimmed)) ?? []);
  const hasNoSearchResult = Boolean(trimmed) && filteredUniversities.length === 0;

  const handleUniversitySelect = (universityId: string, universityName: string) => () => {
    update({ universityId, universityName });
    navigate('/signup/studentid');
  };

  const handleInquiryClick = () => {
    window.open(KAKAO_OPEN_CHAT_URL, '_blank');
  };

  return (
    <StepLayout title="학교를 검색해주세요" description={`정확한 답변을 하지 않으면\n불이익이 발생할 수 있습니다.`}>
      <input
        type="text"
        value={universityName}
        placeholder="학교를 입력해주세요.."
        onChange={(e) => setUniversityName(e.target.value)}
        className="text-h3 mt-5 w-full border-b-2 border-indigo-400 py-4 text-indigo-300 placeholder:text-indigo-300"
      />
      <div className="mt-7 flex flex-col gap-2">
        {filteredUniversities.map((university) => (
          <UniversityCard
            key={university.id}
            label={university.name}
            onClick={handleUniversitySelect(university.id, university.name)}
          />
        ))}

        {hasNoSearchResult && (
          <div className="text-sub3 px-1 pt-2 text-indigo-300">{`'${trimmed}' 검색 결과가 없어요`}</div>
        )}

        <button
          type="button"
          onClick={handleInquiryClick}
          className="text-sub3 mt-2 w-fit self-end px-1 text-indigo-300 underline underline-offset-4 transition-colors hover:text-indigo-400"
        >
          자신의 학교가 목록에 없나요?
        </button>
      </div>
    </StepLayout>
  );
}

export default UniversityStep;
