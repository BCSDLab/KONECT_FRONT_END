import { useState } from 'react';
import BottomModal from '@/components/common/BottomModal';
import Toast from '@/components/common/Toast';
import { useInquiryMutation } from '@/pages/Auth/SignUp/hooks/useInquiry';
import useBooleanState from '@/utils/hooks/useBooleanState';
import { useToast } from '@/utils/hooks/useToast';
import { useWithdrawMutation } from '../MyPage/hooks/useWithdraw';
import { useMyInfo } from './hooks/useMyInfo';

const fields = [
  { label: '학교명', name: 'universityName' },
  { label: '이메일', name: 'email' },
  { label: '이름', name: 'name' },
  { label: '학번', name: 'studentNumber' },
] as const;

function Profile() {
  const { toast, showToast, hideToast } = useToast();
  const { myInfo } = useMyInfo({});
  const { mutate: withdraw } = useWithdrawMutation();
  const { mutate: submitInquiry, isPending: isInquiryPending } = useInquiryMutation();

  const { value: isOpen, setTrue: openModal, setFalse: closeModal } = useBooleanState(false);
  const { value: isInquiryModalOpen, setTrue: openInquiryModal, setFalse: closeInquiryModal } = useBooleanState(false);
  const [inquiryContent, setInquiryContent] = useState('');

  const handleInquirySubmit = () => {
    const trimmedContent = inquiryContent.trim();
    if (!trimmedContent) return;
    submitInquiry(
      { type: 'PROFILE_MODIFY', content: trimmedContent },
      {
        onSuccess: () => {
          closeInquiryModal();
          setInquiryContent('');
          showToast('문의가 접수되었습니다', 'success');
        },
        onError: () => {
          showToast('문의 접수에 실패했습니다. 다시 시도해주세요', 'error');
        },
      }
    );
  };

  return (
    <div className="flex flex-1 flex-col gap-2 bg-white px-5 py-6 pb-10">
      {fields.map(({ label, name }) => (
        <div key={name} className="flex flex-col gap-1">
          <label className="text-[15px] leading-6 font-medium text-indigo-300">{label}</label>
          <input
            name={name}
            value={myInfo?.[name] ?? ''}
            disabled
            className="bg-indigo-5 rounded-lg p-2 text-[15px] leading-6 font-semibold disabled:text-indigo-200"
          />
        </div>
      ))}
      <div className="text-end text-[10px] leading-3 font-medium text-indigo-300">
        정보 수정은 관리자에게 문의해주세요
      </div>
      <div className="flex justify-end text-[10px] leading-3 font-medium text-indigo-300">
        <button type="button" onClick={openModal} className="text-[#3182f6]">
          탈퇴
        </button>
        <span>를 원하시나요?</span>
      </div>

      <button
        onClick={openInquiryModal}
        className="bg-primary text-indigo-5 mt-auto w-full rounded-lg py-2.5 text-center text-lg leading-7 font-bold"
      >
        문의하기
      </button>

      <BottomModal isOpen={isInquiryModalOpen} onClose={closeInquiryModal}>
        <div className="flex flex-col gap-10 px-8 pt-7 pb-4">
          <div className="text-h3 text-center whitespace-pre-wrap">프로필 정보 수정 문의</div>
          <textarea
            value={inquiryContent}
            onChange={(e) => setInquiryContent(e.target.value)}
            placeholder="문의 내용을 입력해주세요"
            aria-label="문의 내용"
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

      <BottomModal isOpen={isOpen} onClose={closeModal}>
        <div className="flex flex-col gap-10 px-8 pt-7 pb-4">
          <div className="text-h3 text-center whitespace-pre-wrap">
            정말로 탈퇴하시겠어요?{'\n'}탈퇴 후 코넥트의 기능을 사용할 수 없어요
          </div>
          <div>
            <button
              onClick={() => withdraw()}
              className="bg-primary text-h3 w-full rounded-lg py-3.5 text-center text-white"
            >
              탈퇴하기
            </button>
            <button onClick={closeModal} className="text-h3 w-full rounded-lg py-3.5 text-center text-indigo-400">
              취소
            </button>
          </div>
        </div>
      </BottomModal>

      <Toast toast={toast} onClose={hideToast} />
    </div>
  );
}

export default Profile;
