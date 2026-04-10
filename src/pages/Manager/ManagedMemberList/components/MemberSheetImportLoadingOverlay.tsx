import Portal from '@/components/common/Portal';

const SPINNER_BAR_COUNT = 12;
const SPINNER_BARS = Array.from({ length: SPINNER_BAR_COUNT });

interface MemberSheetImportLoadingOverlayProps {
  isOpen: boolean;
}

function MemberSheetImportLoadingOverlay({ isOpen }: MemberSheetImportLoadingOverlayProps) {
  if (!isOpen) return null;

  return (
    <Portal>
      <div
        role="status"
        aria-live="polite"
        className="fixed inset-0 z-100 flex items-center justify-center bg-black/50"
      >
        <div className="flex w-52.25 flex-col items-center gap-3 rounded-lg bg-white p-5">
          <div className="relative size-25">
            {SPINNER_BARS.map((_, index) => (
              <span
                key={index}
                className="absolute top-1/2 left-1/2 block h-[28%] w-[8%] rounded-full bg-[#5a6b7f]"
                style={{
                  transform: `translate(-50%, -50%) rotate(${index * 30}deg) translateY(-130%)`,
                  animation: 'ios-spinner-fade 1.2s linear infinite',
                  animationDelay: `${(index - SPINNER_BAR_COUNT) / 10}s`,
                }}
              />
            ))}
          </div>
          <p className="text-text-500 py-1.25 text-[16px] leading-[1.6] font-semibold">인명부를 불러오는중..</p>
        </div>
      </div>
    </Portal>
  );
}

export default MemberSheetImportLoadingOverlay;
