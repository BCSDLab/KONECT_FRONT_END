import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomModal from '@/components/common/BottomModal';
import { useToastContext } from '@/contexts/useToastContext';
import { API_ERROR_CODES } from '@/interface/error';
import { useSignupStore } from '@/stores/signupStore';
import useBooleanState from '@/utils/hooks/useBooleanState';
import StepLayout from './components/StepLayout';
import { useInquiryMutation } from './hooks/useInquiry';
import { useSignupMutation } from './hooks/useSignup';

function ConfirmStep() {
  const navigate = useNavigate();
  const { showToast } = useToastContext();
  const { mutate, isPending, error } = useSignupMutation();
  const { mutate: submitInquiry, isPending: isInquiryPending } = useInquiryMutation();

  const [inquiryContent, setInquiryContent] = useState('');
  const { universityName, universityId, studentId, isMarketingAgreement, name, reset } = useSignupStore();
  const { value: isInquiryModalOpen, setTrue: openInquiryModal, setFalse: closeInquiryModal } = useBooleanState(false);

  useEffect(() => {
    if (error?.apiError?.code === API_ERROR_CODES.DUPLICATE_STUDENT_NUMBER) {
      openInquiryModal();
    }
  }, [error, openInquiryModal]);

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

  const handleInquirySubmit = () => {
    const trimmedContent = inquiryContent.trim();
    if (!trimmedContent) return;
    const fullContent = trimmedContent;
    submitInquiry(
      { type: 'DUPLICATE_STUDENT', content: fullContent },
      {
        onSuccess: () => {
          closeInquiryModal();
          setInquiryContent('');
          showToast('문의가 접수되었습니다', 'success');
        },
      }
    );
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
      <BottomModal isOpen={isInquiryModalOpen} onClose={closeInquiryModal}>
        <div className="flex flex-col gap-10 px-8 pt-7 pb-4">
          <div className="text-h3 text-center whitespace-pre-wrap">
            이미 등록된 학번입니다{'\n'}
            문의를 통해 문제를 해결해주세요
          </div>
          <textarea
            value={inquiryContent}
            onChange={(e) => setInquiryContent(e.target.value)}
            placeholder="문의 내용을 입력해주세요"
            className="text-sub2 min-h-32 w-full resize-none rounded-lg border-2 border-indigo-200 p-4 placeholder:text-indigo-300"
          />
          <button
            onClick={handleInquirySubmit}
            disabled={isInquiryPending || !inquiryContent.trim()}
            className="bg-primary text-h3 w-full rounded-lg py-3.5 text-center text-white disabled:opacity-50"
          >
            {isInquiryPending ? '전송 중...' : '문의하기'}
          </button>
        </div>
      </BottomModal>
    </StepLayout>
  );
}

export default ConfirmStep;
