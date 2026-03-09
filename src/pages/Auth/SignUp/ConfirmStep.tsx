import { useNavigate } from 'react-router-dom';
import { KAKAO_OPEN_CHAT_URL } from '@/constants/links';
import { API_ERROR_CODES } from '@/interface/error';
import { useSignupStore } from '@/stores/signupStore';
import StepLayout from './components/StepLayout';
import { useSignupMutation } from './hooks/useSignup';

function ConfirmStep() {
  const navigate = useNavigate();
  const { mutate, isPending, error } = useSignupMutation();

  const { universityName, universityId, studentId, isMarketingAgreement, name, reset } = useSignupStore();

  const isDuplicateStudentNumber = error?.apiError?.code === API_ERROR_CODES.DUPLICATE_STUDENT_NUMBER;

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

  const handleInquiryClick = () => {
    window.open(KAKAO_OPEN_CHAT_URL, '_blank');
  };

  return (
    <StepLayout
      title="정보를 확인해주세요"
      description={`정보가 부정확할 경우 불이익이 발생할 수 있습니다`}
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
      {isDuplicateStudentNumber && (
        <button
          type="button"
          onClick={handleInquiryClick}
          className="text-sub3 mt-2 w-fit self-end px-1 text-indigo-300 underline underline-offset-4 transition-colors hover:text-indigo-400"
        >
          이미 등록된 학번입니다. 문의하기
        </button>
      )}
    </StepLayout>
  );
}

export default ConfirmStep;
