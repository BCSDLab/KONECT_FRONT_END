import SheetGuide from '@/assets/image/sheet-guide.png';
import BottomModal from '@/components/common/BottomModal';

interface MemberSheetImportModalProps {
  errorMessage: string | null;
  isOpen: boolean;
  isSubmitting: boolean;
  onChangeUrl: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  spreadsheetUrl: string;
}

function MemberSheetImportModal({
  errorMessage,
  isOpen,
  isSubmitting,
  onChangeUrl,
  onClose,
  onSubmit,
  spreadsheetUrl,
}: MemberSheetImportModalProps) {
  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <BottomModal
      isOpen={isOpen}
      onClose={onClose}
      className="rounded-t-4xl bg-white shadow-[0px_8px_20px_0px_rgba(0,0,0,0.06),0px_24px_60px_0px_rgba(0,0,0,0.12)]"
      overlayClassName="bg-black/50"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-6 pt-8 pb-[calc(24px+var(--sab))]">
        <div className="flex flex-col gap-3">
          <h2 className="text-[18px] leading-[1.6] font-semibold">구글 시트를 통해 부원을 등록할 수 있어요</h2>

          <div className="flex flex-col gap-3">
            <input
              type="text"
              inputMode="url"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              value={spreadsheetUrl}
              onChange={(event) => onChangeUrl(event.target.value)}
              placeholder="스프레드 시트 링크를 붙여넣으세요."
              className="border-text-200 placeholder:text-text-400 focus:border-primary-500 rounded-2xl border px-3 py-[7.5px] text-[13px] leading-[1.6] font-medium outline-none"
            />

            {errorMessage && <p className="text-[14px] leading-[1.6] font-medium text-red-500">{errorMessage}</p>}

            <p className="text-[14px] leading-[1.6] font-medium text-indigo-400">
              ‘링크가 있는 모든 사용자 보기’로 설정해주세요.
            </p>
          </div>

          <img src={SheetGuide} alt="시트 가이드" className="w-full rounded-2xl" />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary-500 disabled:bg-text-200 h-12 w-full rounded-2xl text-[18px] leading-[1.6] font-semibold text-white"
        >
          {isSubmitting ? '불러오는 중...' : '불러오기'}
        </button>
      </form>
    </BottomModal>
  );
}

export default MemberSheetImportModal;
