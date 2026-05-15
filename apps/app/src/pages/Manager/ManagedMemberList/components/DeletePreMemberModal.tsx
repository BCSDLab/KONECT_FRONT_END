import BottomModal from '@/components/common/BottomModal';

interface DeletePreMemberModalProps {
  isDeletingPreMember: boolean;
  isPending: boolean;
  isOpen: boolean;
  memberName: string | undefined;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeletePreMemberModal({
  isDeletingPreMember,
  isPending,
  isOpen,
  memberName,
  onClose,
  onConfirm,
}: DeletePreMemberModalProps) {
  return (
    <BottomModal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-3 p-5">
        <div className="text-body2 font-semibold text-indigo-700">사전 등록 삭제</div>
        <div className="text-body3 text-indigo-400">정말 {memberName}님의 사전 등록을 삭제하시겠어요?</div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="border-indigo-25 flex-1 rounded-lg border py-3 text-center font-bold"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 rounded-lg bg-red-500 py-3 text-center font-bold text-white disabled:opacity-50"
          >
            {isDeletingPreMember ? '삭제 중...' : '삭제'}
          </button>
        </div>
      </div>
    </BottomModal>
  );
}
