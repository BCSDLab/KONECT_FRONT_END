import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignupStore } from '@/stores/signupStore';
import StepLayout from './components/StepLayout';
import { useSignupMutation } from './hooks/useSignup';

function NameStep() {
  const navigate = useNavigate();
  const { universityId, studentId, isMarketingAgreement, name: savedName, reset } = useSignupStore();
  const { mutate, isPending, isError } = useSignupMutation();

  const [name, setName] = useState(savedName ?? '');

  const handleNext = () => {
    mutate(
      {
        name,
        universityId,
        studentNumber: studentId,
        isMarketingAgreement,
      },
      {
        onSuccess: () => {
          reset();
          navigate('/signup/finish');
        },
      }
    );
  };

  return (
    <StepLayout
      title="이름을 입력해주세요"
      description={`정확한 답변을 하지 않으면\n불이익이 발생할 수 있습니다.`}
      onNext={handleNext}
      nextDisabled={!name.trim() || isPending}
    >
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mt-5 w-full border-b-2 border-indigo-400 py-4 text-[20px] font-bold text-indigo-300"
      />
      {isError && <p className="mt-2 text-sm text-red-500">회원가입에 실패했습니다.</p>}
    </StepLayout>
  );
}

export default NameStep;
