import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSignupStore } from '@/stores/signupStore';
import StepLayout from './components/StepLayout';

function StudentIdStep() {
  const navigate = useNavigate();
  const update = useSignupStore((state) => state.update);

  const [studentId, setStudentId] = useState('');

  const handleNext = () => {
    update({ studentId });
    navigate('/signup/profile/name');
  };

  return (
    <StepLayout
      title="학번을 입력해주세요"
      description={`정확한 답변을 하지 않으면\n불이익이 발생할 수 있습니다.`}
      onNext={handleNext}
      nextDisabled={!studentId.trim()}
    >
      <input
        type="text"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
        className="mt-5 w-full border-b-2 border-indigo-400 py-4 text-[20px] font-bold text-indigo-300"
      />
    </StepLayout>
  );
}

export default StudentIdStep;
