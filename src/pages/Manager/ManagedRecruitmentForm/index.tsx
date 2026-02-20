import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import type { ClubQuestionRequest } from '@/apis/club/entity';
import TrashIcon from '@/assets/svg/trash-full.svg';
import { useManagedClubQuestions, useManagedClubQuestionsMutation } from '@/pages/Manager/hooks/useManagedRecruitment';
import { usePatchClubSettings } from '@/pages/Manager/hooks/useManagedSettings';

const DEFAULT_PHONE_QUESTION = '지원자의 전화번호를 입력해주세요.';

interface QuestionItem extends ClubQuestionRequest {
  tempId: string;
}

function ManagedRecruitmentForm() {
  const { clubId } = useParams<{ clubId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { managedClubQuestions } = useManagedClubQuestions(Number(clubId));
  const { mutate: updateQuestions, isPending, error } = useManagedClubQuestionsMutation(Number(clubId));
  const { mutate: patchSettings } = usePatchClubSettings(Number(clubId));

  const [questions, setQuestions] = useState<QuestionItem[]>(() => {
    if (managedClubQuestions.questions.length === 0) {
      return [{ tempId: crypto.randomUUID(), question: DEFAULT_PHONE_QUESTION, isRequired: true }];
    }
    return managedClubQuestions.questions.map((q) => ({
      tempId: crypto.randomUUID(),
      questionId: q.id,
      question: q.question,
      isRequired: q.isRequired,
    }));
  });

  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        tempId: crypto.randomUUID(),
        question: '',
        isRequired: false,
      },
    ]);
  };

  const handleDeleteQuestion = (tempId: string) => {
    setQuestions((prev) => prev.filter((q) => q.tempId !== tempId));
  };

  const handleQuestionChange = (tempId: string, value: string) => {
    setQuestions((prev) => prev.map((q) => (q.tempId === tempId ? { ...q, question: value } : q)));
  };

  const handleRequiredChange = (tempId: string, checked: boolean) => {
    setQuestions((prev) => prev.map((q) => (q.tempId === tempId ? { ...q, isRequired: checked } : q)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const requestData = {
      questions: questions.map(({ questionId, question, isRequired }) => ({
        ...(questionId && { questionId }),
        question,
        isRequired,
      })),
    };

    updateQuestions(requestData, {
      onSuccess: () => {
        if (location.state?.enableAfterSave) {
          patchSettings({ isApplicationEnabled: true }, { onSuccess: () => navigate(-1) });
        }
      },
    });
  };

  const hasEmptyQuestion = questions.some((q) => !q.question.trim());

  return (
    <div className="flex h-full flex-col">
      <form id="question-form" onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4 overflow-auto p-3">
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-h4">가입 문항 설정</span>
            <span className="text-sub4 text-gray-500">{questions.length}개의 문항</span>
          </div>

          {questions.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-lg bg-white p-8 shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
              <p className="text-sub3 text-gray-400">등록된 문항이 없습니다.</p>
              <button type="button" onClick={handleAddQuestion} className="text-sub3 text-indigo-600 hover:underline">
                문항 추가하기
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {questions.map((q, index) => (
                <div
                  key={q.tempId}
                  className="flex flex-col gap-3 rounded-lg bg-white p-4 shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sub2 font-semibold text-indigo-700">문항 {index + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteQuestion(q.tempId)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                    >
                      <TrashIcon className="h-5 w-5 text-black" />
                    </button>
                  </div>

                  <textarea
                    value={q.question}
                    onChange={(e) => handleQuestionChange(q.tempId, e.target.value)}
                    placeholder="질문을 입력해주세요."
                    rows={2}
                    className={twMerge(
                      'text-sub3 w-full resize-none rounded-lg border border-gray-200 p-3 transition-colors focus:border-indigo-500 focus:outline-none',
                      !q.question.trim() && 'border-red-300'
                    )}
                  />

                  <div className="flex items-center gap-2">
                    <input
                      id={`required-${q.tempId}`}
                      type="checkbox"
                      checked={q.isRequired}
                      onChange={(e) => handleRequiredChange(q.tempId, e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label
                      htmlFor={`required-${q.tempId}`}
                      className="text-sub4 cursor-pointer text-gray-600 select-none"
                    >
                      필수 응답
                    </label>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={handleAddQuestion}
            className="hover:bg-indigo-25 flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-indigo-200 py-3 text-indigo-600 transition-colors hover:border-indigo-400"
          >
            <span className="text-xl font-bold">+</span>
            <span className="text-sub3">문항 추가</span>
          </button>
        </section>
      </form>

      <div className="flex flex-col gap-2 p-3" style={{ marginBottom: 'calc(20px + var(--sab))' }}>
        {error && <p className="text-sm text-red-500">{error.message ?? '가입 문항 저장에 실패했습니다.'}</p>}
        <button
          type="submit"
          form="question-form"
          disabled={isPending || hasEmptyQuestion}
          className="bg-primary w-full rounded-lg py-3 text-white transition-colors hover:bg-indigo-800 disabled:cursor-not-allowed disabled:bg-indigo-300"
        >
          {isPending ? '저장 중...' : '가입 문항 저장'}
        </button>
      </div>
    </div>
  );
}

export default ManagedRecruitmentForm;
