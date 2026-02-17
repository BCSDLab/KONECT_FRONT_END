import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RightArrowIcon from '@/assets/svg/chevron-right.svg';
import BottomModal from '@/components/common/BottomModal';
import Card from '@/components/common/Card';
import Toast from '@/components/common/Toast';
import { useSignupStore } from '@/stores/signupStore';
import useBooleanState from '@/utils/hooks/useBooleanState';
import { useToast } from '@/utils/hooks/useToast';
import StepLayout from './components/StepLayout';
import { useInquiryMutation } from './hooks/useInquiry';
import { useGetUniversityList } from './hooks/useUniversity';

function UniversityCard({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Card onClick={onClick} className="border-indigo-75 flex w-full flex-row items-center justify-between">
      <div className="text-sub2">{label}</div>
      <RightArrowIcon />
    </Card>
  );
}

function UniversityStep() {
  const navigate = useNavigate();

  const [universityName, setUniversityName] = useState('');

  const update = useSignupStore((state) => state.update);
  const { data: universityList } = useGetUniversityList();
  const { value: isInquiryModalOpen, setTrue: openInquiryModal, setFalse: closeInquiryModal } = useBooleanState(false);
  const { toast, showToast, hideToast } = useToast();
  const [inquiryContent, setInquiryContent] = useState('');
  const { mutate: submitInquiry, isPending } = useInquiryMutation();

  const trimmed = universityName.trim();
  const filteredUniversities = !trimmed
    ? (universityList?.universities ?? [])
    : (universityList?.universities.filter((university) => university.name.includes(trimmed)) ?? []);
  const hasNoSearchResult = Boolean(trimmed) && filteredUniversities.length === 0;

  const handleUniversitySelect = (universityId: string, universityName: string) => () => {
    update({ universityId, universityName });
    navigate('/signup/studentid');
  };

  const handleInquirySubmit = () => {
    const trimmedContent = inquiryContent.trim();
    if (!trimmedContent) return;
    const fullContent = trimmedContent;
    submitInquiry(
      { type: 'UNIVERSITY_NOT_FOUND', content: fullContent },
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
    <StepLayout title="학교를 검색해주세요" description={`정확한 답변을 하지 않으면\n불이익이 발생할 수 있습니다.`}>
      <input
        type="text"
        value={universityName}
        placeholder="학교를 입력해주세요.."
        onChange={(e) => setUniversityName(e.target.value)}
        className="text-h3 mt-5 w-full border-b-2 border-indigo-400 py-4 text-indigo-300 placeholder:text-indigo-300"
      />
      <div className="mt-7 flex flex-col gap-2">
        {filteredUniversities.map((university) => (
          <UniversityCard
            key={university.id}
            label={university.name}
            onClick={handleUniversitySelect(university.id, university.name)}
          />
        ))}

        {hasNoSearchResult && (
          <div className="text-sub3 px-1 pt-2 text-indigo-300">{`'${trimmed}' 검색 결과가 없어요`}</div>
        )}

        <button
          type="button"
          onClick={openInquiryModal}
          className="text-sub3 mt-2 w-fit self-end px-1 text-indigo-300 underline underline-offset-4 transition-colors hover:text-indigo-400"
        >
          자신의 학교가 목록에 없나요?
        </button>
      </div>

      <BottomModal isOpen={isInquiryModalOpen} onClose={closeInquiryModal}>
        <div className="flex flex-col gap-10 px-8 pt-7 pb-4">
          <div className="text-h3 text-center">학교 문의</div>
          <textarea
            value={inquiryContent}
            onChange={(e) => setInquiryContent(e.target.value)}
            placeholder="추가를 원하는 학교 이름을 정확히 입력해주세요"
            className="text-sub2 min-h-32 w-full resize-none rounded-lg border-2 border-indigo-200 p-4 placeholder:text-indigo-300"
          />
          <button
            onClick={handleInquirySubmit}
            disabled={isPending || !inquiryContent.trim()}
            className="bg-primary text-h3 w-full rounded-lg py-3.5 text-center text-white disabled:opacity-50"
          >
            {isPending ? '전송 중...' : '문의하기'}
          </button>
        </div>
      </BottomModal>

      <Toast toast={toast} onClose={hideToast} />
    </StepLayout>
  );
}

export default UniversityStep;
