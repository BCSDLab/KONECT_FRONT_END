import { useState, type FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import BottomModal from '@/components/common/BottomModal';
import useBooleanState from '@/utils/hooks/useBooleanState';
import useClubApply from './hooks/useClubApply';

function ApplicationPage() {
  const { clubId } = useParams();
  const { clubQuestions, applyToClub } = useClubApply(Number(clubId));
  const [answers, setAnswers] = useState<Record<number, string>>({});
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
    await applyToClub({ answers: formattedAnswers });
  };

  return (
    <div className="bg-indigo-0 flex min-h-0 flex-1 flex-col px-3 pt-3 pb-10">
      <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col gap-5">
        <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto">
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
          className="bg-primary w-full rounded-lg py-3.5 text-center text-lg leading-7 font-bold text-white"
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
