import { useState, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BottomModal from '@/components/common/BottomModal';
import { useClubApplicationStore } from '@/stores/clubApplicationStore';
import useBooleanState from '@/utils/hooks/useBooleanState';
import useClubApply from './hooks/useClubApply';

function ApplicationPage() {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const { clubQuestions, applyToClub, isFeeRequired, isFeeLoading } = useClubApply(Number(clubId));
  const { answers: storedAnswers, clubId: storedClubId } = useClubApplicationStore();
  const setApplication = useClubApplicationStore((s) => s.setApplication);
  const [answers, setAnswers] = useState<Record<number, string>>(() =>
    storedClubId === Number(clubId)
      ? Object.fromEntries(storedAnswers.map(({ questionId, answer }) => [questionId, answer]))
      : {}
  );
  const { value: isConfirmOpen, setTrue: openConfirm, setFalse: closeConfirm } = useBooleanState();

  const handleChange = (questionId: number, value: string, target: HTMLTextAreaElement) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    target.style.height = 'auto';
    target.style.height = `${target.scrollHeight}px`;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    openConfirm();
  };

  const handleConfirm = async () => {
    const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
      questionId: Number(questionId),
      answer,
    }));

    if (isFeeRequired) {
      setApplication(Number(clubId), formattedAnswers);
      navigate(`/clubs/${clubId}/fee`);
    } else {
      await applyToClub({ answers: formattedAnswers });
    }
  };

  return (
    <div
      className="bg-indigo-0 flex flex-1 flex-col justify-between px-3 pt-3"
      style={{ marginBottom: 'calc(20px + var(--sab))' }}
    >
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col justify-between">
        <div className="flex flex-col gap-5">
          {clubQuestions?.questions.map((question) => (
            <div key={question.id} className="flex flex-col gap-2">
              <label className="text-[15px] leading-6 font-medium text-indigo-300">
                {question.question}
                {question.isRequired && <span className="text-[#EA4335]">*</span>}
              </label>
              <textarea
                value={answers[question.id] || ''}
                onChange={(e) => handleChange(question.id, e.target.value, e.target)}
                required={question.isRequired}
                className="bg-indigo-5 placeholder:text-indigo-75 min-h-32 w-full resize-none rounded-lg p-3 leading-6 font-medium"
                placeholder="내용을 입력해주세요"
              />
            </div>
          ))}
        </div>
        <button
          type="submit"
          disabled={isFeeLoading}
          className="bg-primary mt-5 w-full rounded-lg py-2.5 text-center text-lg leading-7 font-bold text-white disabled:opacity-50"
        >
          제출하기
        </button>
      </form>
      <BottomModal isOpen={isConfirmOpen} onClose={closeConfirm}>
        <div className="flex flex-col gap-10 px-8 pt-7 pb-4">
          <div className="text-h3 text-center whitespace-pre-wrap">지원서를 제출하시겠어요?</div>
          <div>
            <button
              type="button"
              onClick={handleConfirm}
              className="bg-primary text-h3 w-full rounded-lg py-3.5 text-center text-white"
            >
              제출하기
            </button>
            <button
              type="button"
              onClick={closeConfirm}
              className="text-h3 w-full rounded-lg py-3.5 text-center text-indigo-400"
            >
              취소
            </button>
          </div>
        </div>
      </BottomModal>
    </div>
  );
}

export default ApplicationPage;
