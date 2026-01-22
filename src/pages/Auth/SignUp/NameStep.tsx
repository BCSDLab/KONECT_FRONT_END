import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignupStore } from '@/stores/signupStore';
import StepLayout from './components/StepLayout';

function NameStep() {
  const navigate = useNavigate();
  const { name: savedName, update } = useSignupStore();

  const [name, setName] = useState(savedName ?? '');

  const handleNext = () => {
    update({ name });
    navigate('/signup/confirm');
  };

  return (
    <StepLayout
      title="이름을 입력해주세요"
      description={`정확한 답변을 하지 않으면\n불이익이 발생할 수 있습니다.`}
      onNext={handleNext}
      nextDisabled={!name.trim()}
    >
      <input
        type="text"
        value={name}
        onChange={(e) => {
          const value = e.target.value.replace(/[^a-zA-Z가-힣ㆍᆞᆢㄱ-ㅎㅏ-ㅣ\s]/g, '');
          setName(value);
        }}
        className="text-h3 mt-5 w-full border-b-2 border-indigo-400 py-4 text-indigo-300"
      />
    </StepLayout>
  );
}

export default NameStep;
