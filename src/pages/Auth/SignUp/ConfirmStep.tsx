import { useNavigate } from 'react-router-dom';
import { useSignupStore } from '@/stores/signupStore';
import StepLayout from './components/StepLayout';
import { useSignupMutation } from './hooks/useSignup';

function ConfirmStep() {
  const navigate = useNavigate();
  const { universityName, universityId, studentId, isMarketingAgreement, name, reset } = useSignupStore();
  const { mutate, isPending, error } = useSignupMutation();

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
      title="정보를 확인해주세요"
      description={`정보를 확인해주세요\n정보가 부정확할 경우 불이익이 발생할 수 있습니다`}
      onNext={handleNext}
      nextDisabled={isPending}
      color="text-red-500"
    >
      <div className="flex flex-col gap-1">
        <label className="text-sub2 text-indigo-300">학교명</label>
        <input
          type="text"
          value={universityName}
          disabled
          className="bg-indigo-5 text-sub1 rounded-lg p-2 disabled:text-indigo-200"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sub2 text-indigo-300">학번</label>
        <input
          type="text"
          value={studentId}
          disabled
          className="bg-indigo-5 text-sub1 rounded-lg p-2 disabled:text-indigo-200"
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sub2 text-indigo-300">이름</label>
        <input
          type="text"
          value={name}
          disabled
          className="bg-indigo-5 text-sub1 rounded-lg p-2 disabled:text-indigo-200"
        />
      </div>
      {error && (
        <div className="mt-2 text-sm text-red-500">
          {error.apiError?.fieldErrors?.length ? (
            error.apiError.fieldErrors.map((fieldError) => <p key={fieldError.message}>{fieldError.message}</p>)
          ) : (
            <p>{error.message ?? '회원가입에 실패했습니다.'}</p>
          )}
        </div>
      )}
    </StepLayout>
  );
}

export default ConfirmStep;
