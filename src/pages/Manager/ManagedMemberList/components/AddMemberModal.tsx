import BottomModal from '@/components/common/BottomModal';

interface AddMemberModalProps {
  isAdding: boolean;
  isPending: boolean;
  isOpen: boolean;
  name: string;
  onChangeName: (value: string) => void;
  onChangeStudentNumber: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  studentNumber: string;
}

export default function AddMemberModal({
  isAdding,
  isPending,
  isOpen,
  name,
  onChangeName,
  onChangeStudentNumber,
  onClose,
  onSubmit,
  studentNumber,
}: AddMemberModalProps) {
  return (
    <BottomModal
      isOpen={isOpen}
      onClose={onClose}
      className="rounded-t-4xl bg-white shadow-[0px_8px_20px_0px_rgba(0,0,0,0.06),0px_24px_60px_0px_rgba(0,0,0,0.12)]"
      overlayClassName="bg-black/50"
    >
      <div className="flex flex-col pb-6">
        <div className="flex items-center justify-center py-3">
          <div className="h-1 w-11 rounded-full bg-indigo-200" />
        </div>

        <div className="flex flex-col gap-3 px-6 pt-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-h2 text-black">부원 추가하기</h2>
            <p className="text-sub2 text-indigo-400">서비스에 가입하지 않은 학생을 사전 등록해주세요.</p>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="pre-member-student-number" className="text-sub3 text-text-700">
              학번
            </label>
            <input
              id="pre-member-student-number"
              type="text"
              inputMode="numeric"
              value={studentNumber}
              onChange={(e) => onChangeStudentNumber(e.target.value.replace(/\D/g, ''))}
              placeholder="학번을 입력해주세요."
              className="text-sub3 border-text-200 placeholder:text-text-400 focus:border-primary-500 h-9 rounded-2xl border px-3 text-indigo-700 outline-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="pre-member-name" className="text-sub3 text-text-700">
              이름
            </label>
            <input
              id="pre-member-name"
              type="text"
              value={name}
              onChange={(e) => onChangeName(e.target.value)}
              placeholder="이름을 입력해주세요."
              className="text-sub3 border-text-200 placeholder:text-text-400 focus:border-primary-500 h-9 rounded-2xl border px-3 text-indigo-700 outline-none"
            />
          </div>
        </div>

        <div className="px-4.5 pt-6">
          <button
            type="button"
            onClick={onSubmit}
            disabled={!studentNumber || !name || isPending}
            className="text-h2 bg-primary-500 disabled:bg-text-200 h-12 w-full rounded-2xl text-white"
          >
            {isAdding ? '추가 중...' : '추가'}
          </button>
        </div>
      </div>
    </BottomModal>
  );
}
