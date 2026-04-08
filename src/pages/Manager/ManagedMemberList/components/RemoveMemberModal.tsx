import BottomModal from '@/components/common/BottomModal';

interface RemoveMemberModalProps {
  isPending: boolean;
  isOpen: boolean;
  isRemoving: boolean;
  memberName: string | undefined;
  onClose: () => void;
  onConfirm: () => void;
}

export default function RemoveMemberModal({
  isPending,
  isOpen,
  isRemoving,
  memberName,
  onClose,
  onConfirm,
}: RemoveMemberModalProps) {
  return (
    <BottomModal
      isOpen={isOpen}
      onClose={onClose}
      className="rounded-t-4xl bg-white shadow-[0px_8px_20px_0px_rgba(0,0,0,0.06),0px_24px_60px_0px_rgba(0,0,0,0.12)]"
      overlayClassName="bg-black/50"
    >
      <div className="flex flex-col pb-3.75">
        <div className="border-indigo-25 border-b px-6.75 py-4.5">
          <h2 className="text-text-700 leading-[1.6] font-semibold">부원 삭제</h2>
        </div>

        <div className="px-6.75 pt-5">
          <p className="text-text-700 text-[15px] leading-[1.6] font-medium">정말 {memberName}님을 삭제하시겠어요?</p>
        </div>

        <div className="flex gap-3 px-5.25 pt-5.5">
          <button
            type="button"
            onClick={onClose}
            className="border-primary-500 text-primary-500 h-13.75 flex-1 rounded-2xl border text-center text-[16px] leading-5.5 font-bold tracking-[-0.408px]"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="border-primary-500 bg-primary-500 h-13.75 flex-1 rounded-2xl border text-center text-[16px] leading-5.5 font-bold tracking-[-0.408px] text-white disabled:opacity-50"
          >
            {isRemoving ? '삭제 중...' : '삭제'}
          </button>
        </div>
      </div>
    </BottomModal>
  );
}
