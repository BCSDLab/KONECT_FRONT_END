import { useState } from 'react';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import type { ClubQuestion, ClubQuestionRequest } from '@/apis/club/entity';
import { managedClubQueries } from '@/apis/club/managedQueries';
import CheckIcon from '@/assets/svg/check.svg';
import ToggleSwitch from '@/components/common/ToggleSwitch';
import { useToastContext } from '@/contexts/useToastContext';
import {
  usePatchManagedClubSettingsMutation,
  useUpdateManagedClubQuestionsMutation,
} from '@/pages/Manager/hooks/useManagedClubMutations';
import { cn } from '@/utils/ts/cn';
import { getApiErrorMessage } from '@/utils/ts/error/apiErrorMessage';

interface QuestionItem extends ClubQuestionRequest {
  tempId: string;
}

const createQuestionItem = ({ id, question, isRequired }: ClubQuestion): QuestionItem => ({
  tempId: crypto.randomUUID(),
  questionId: id,
  question,
  isRequired,
});

const sectionCardStyle = 'flex w-full flex-col rounded-2xl bg-white px-5 py-5';
const sectionTitleStyle = 'text-[16px] leading-[1.6] font-semibold text-indigo-700';

function ManagedRecruitmentForm() {
  const { clubId } = useParams<{ clubId: string }>();
  const clubIdNumber = Number(clubId);
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToastContext();
  const { data: managedClubQuestions } = useSuspenseQuery(managedClubQueries.questions(clubIdNumber));
  const { data: clubSettings } = useQuery(managedClubQueries.settings(clubIdNumber));
  const { mutate: updateQuestions, isPending, error } = useUpdateManagedClubQuestionsMutation(clubIdNumber);
  const { mutate: patchSettings, isPending: isPatchPending } = usePatchManagedClubSettingsMutation(clubIdNumber);

  const [questions, setQuestions] = useState<QuestionItem[]>(() =>
    managedClubQuestions.questions.map(createQuestionItem)
  );

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

  const hasEmptyQuestion = questions.some((q) => !q.question.trim());
  const isApplicationToggleDisabled = hasEmptyQuestion || isPending || isPatchPending;

  const handleApplicationEnabledChange = (enabled: boolean) => {
    if (isApplicationToggleDisabled) {
      return;
    }

    patchSettings({ isApplicationEnabled: enabled });
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
        showToast('질문이 수정되었습니다', 'success');

        if (location.state?.enableAfterSave) {
          patchSettings({ isApplicationEnabled: true }, { onSuccess: () => navigate(-1) });
          return;
        }

        navigate(-1);
      },
    });
  };

  const isApplicationEnabled = clubSettings?.isApplicationEnabled ?? false;
  const applicationStatusLabel = isApplicationEnabled ? '활성화' : '비활성화';

  return (
    <div className="flex h-full flex-col">
      <form
        id="question-form"
        onSubmit={handleSubmit}
        className="flex flex-1 flex-col overflow-y-auto px-[19px] pt-[18px]"
      >
        <div className="flex flex-col gap-8 pb-8">
          <section className="flex flex-col gap-4">
            <div className="flex justify-end">
              <ToggleSwitch
                variant="manager"
                label={applicationStatusLabel}
                ariaLabel="지원서 활성화 설정"
                enabled={isApplicationEnabled}
                onChange={handleApplicationEnabledChange}
                disabled={isApplicationToggleDisabled}
              />
            </div>

            {questions.length === 0 ? (
              <div className={cn(sectionCardStyle, 'items-center py-10 text-center')}>
                <p className="text-[16px] leading-[1.6] font-medium text-indigo-300">등록된 문항이 없습니다.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {questions.map((q, index) => (
                  <div key={q.tempId} className={sectionCardStyle}>
                    <div className="flex flex-col gap-5">
                      <div className="flex items-start justify-between gap-3">
                        <span className={cn(sectionTitleStyle, 'pl-1')}>{`문항${index + 1}`}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteQuestion(q.tempId)}
                          className="text-[14px] leading-[1.6] font-medium text-[#5a6b7f] transition-opacity active:opacity-70"
                        >
                          삭제하기
                        </button>
                      </div>

                      <textarea
                        value={q.question}
                        onChange={(e) => handleQuestionChange(q.tempId, e.target.value)}
                        placeholder="질문을 입력해주세요."
                        rows={3}
                        className={cn(
                          'border-text-200 focus:border-primary-500 min-h-[71px] w-full resize-none rounded-[10px] border bg-white px-4 py-3.5 text-[13px] leading-[1.6] font-medium text-black placeholder:text-indigo-100 focus:outline-none',
                          !q.question.trim() && 'border-red-300'
                        )}
                      />

                      <label className="flex cursor-pointer items-center gap-0.5">
                        <input
                          type="checkbox"
                          checked={q.isRequired}
                          onChange={(e) => handleRequiredChange(q.tempId, e.target.checked)}
                          className="sr-only"
                        />
                        <span className="flex size-6 shrink-0 items-center justify-center">
                          <span
                            className={cn(
                              'border-text-200 flex size-5 items-center justify-center rounded-sm border-[0.7px] bg-white text-white transition-colors',
                              q.isRequired && 'bg-primary-500 border-primary-500'
                            )}
                          >
                            <CheckIcon className={cn('size-3', q.isRequired ? 'opacity-100' : 'opacity-0')} />
                          </span>
                        </span>
                        <span className="text-text-700 text-[13px] leading-[1.6] font-medium">필수 응답</span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={handleAddQuestion}
              className="border-text-400 flex h-[76px] w-full items-center justify-center rounded-2xl border border-dashed text-[16px] leading-[1.6] font-medium text-[#5a6b7f] transition-colors active:bg-white/60"
            >
              + 문항 추가하기
            </button>
          </section>

          <div className="flex flex-col gap-2">
            {error && (
              <p className="text-[13px] leading-[1.6] font-medium text-red-500">
                {getApiErrorMessage(error, '지원서 수정에 실패했습니다.')}
              </p>
            )}
            <button
              type="submit"
              form="question-form"
              disabled={isPending || isPatchPending || hasEmptyQuestion}
              className="bg-primary-500 disabled:bg-text-200 h-12 w-full rounded-2xl text-[18px] leading-[1.6] font-semibold text-white disabled:cursor-not-allowed"
            >
              {isPending ? '수정 중…' : '지원서 수정'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ManagedRecruitmentForm;
