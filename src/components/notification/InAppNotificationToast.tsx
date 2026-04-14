import NotificationToastApprovedImage from '@/assets/image/notification-toast-approved.png';
import NotificationToastGeneralImage from '@/assets/image/notification-toast-general.png';
import Portal from '@/components/common/Portal';
import { useBottomOverlayOffset } from '@/components/layout/bottomOverlay';
import type { InAppNotificationToastItem } from '@/contexts/useInAppNotificationToastContext';
import { useLayoutElementsContext } from '@/contexts/useLayoutElementsContext';

interface InAppNotificationToastProps {
  toast: InAppNotificationToastItem | null;
  onAction: () => void;
}

function NotificationToneIcon({ variant }: { variant: InAppNotificationToastItem['variant'] }) {
  if (variant === 'approved') {
    return (
      <img src={NotificationToastApprovedImage} alt="" aria-hidden="true" className="h-9 w-9 shrink-0 object-contain" />
    );
  }

  return (
    <img src={NotificationToastGeneralImage} alt="" aria-hidden="true" className="h-7 w-7 shrink-0 object-contain" />
  );
}

function InAppNotificationToast({ toast, onAction }: InAppNotificationToastProps) {
  const { layoutElement } = useLayoutElementsContext();
  const bottomPosition = useBottomOverlayOffset();

  if (!toast) {
    return null;
  }

  return (
    <Portal container={layoutElement}>
      <div
        className="pointer-events-none fixed inset-x-0 z-210 flex justify-center px-5"
        style={{ bottom: bottomPosition }}
      >
        <div
          role="status"
          aria-live="polite"
          className="animate-fade-in-up pointer-events-auto flex w-full max-w-78.75 items-center gap-4 rounded-2xl bg-[rgba(231,235,239,0.9)] px-3 py-4 shadow-[0_0_20px_rgba(0,0,0,0.03)]"
        >
          <NotificationToneIcon variant={toast.variant} />

          <div className="min-w-0 flex-1">
            <p className="text-text-700 text-[16px] leading-[1.6] font-bold break-keep whitespace-pre-line">
              {toast.message}
            </p>
          </div>

          <button
            type="button"
            onClick={onAction}
            className="shrink-0 rounded-[60px] bg-white px-2 py-1 text-[13px] leading-[1.6] font-semibold text-[#5A6B7F] transition-colors active:bg-[#F4F6F9]"
          >
            {toast.actionLabel}
          </button>
        </div>
      </div>
    </Portal>
  );
}

export default InAppNotificationToast;
