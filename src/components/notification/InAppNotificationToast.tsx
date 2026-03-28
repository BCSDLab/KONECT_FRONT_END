import type { InboxNotification } from '@/apis/notification/entity';
import NotificationToastApprovedImage from '@/assets/image/notification-toast-approved.png';
import NotificationToastGeneralImage from '@/assets/image/notification-toast-general.png';
import Portal from '@/components/common/Portal';
import { getBottomOverlayOffset, NOTIFICATION_TOAST_BOTTOM_GAP } from '@/components/layout/layoutMetrics';
import { useLayoutElementsContext } from '@/contexts/useLayoutElementsContext';
import { getInboxNotificationMessage, getInboxNotificationToastVariant } from '@/utils/ts/notification';

interface InAppNotificationToastProps {
  notification: InboxNotification | null;
  onAction: () => void;
}

function NotificationToneIcon({ notification }: { notification: InboxNotification }) {
  const toastVariant = getInboxNotificationToastVariant(notification);

  if (toastVariant === 'approved') {
    return (
      <img src={NotificationToastApprovedImage} alt="" aria-hidden="true" className="h-9 w-9 shrink-0 object-contain" />
    );
  }

  return (
    <img src={NotificationToastGeneralImage} alt="" aria-hidden="true" className="h-7 w-7 shrink-0 object-contain" />
  );
}

function InAppNotificationToast({ notification, onAction }: InAppNotificationToastProps) {
  const { bottomOverlayInset, layoutElement } = useLayoutElementsContext();

  if (!notification) {
    return null;
  }

  const message = getInboxNotificationMessage(notification);
  const bottomPosition = getBottomOverlayOffset(bottomOverlayInset, NOTIFICATION_TOAST_BOTTOM_GAP);

  return (
    <Portal container={layoutElement}>
      <div
        className="pointer-events-none fixed inset-x-0 z-210 flex justify-center px-5"
        style={{ bottom: bottomPosition }}
      >
        <div
          role="status"
          aria-live="polite"
          className="animate-fade-in-up pointer-events-auto flex w-full max-w-[315px] items-center gap-4 rounded-2xl bg-[rgba(231,235,239,0.9)] px-3 py-4 shadow-[0_0_20px_rgba(0,0,0,0.03)]"
        >
          <NotificationToneIcon notification={notification} />

          <div className="min-w-0 flex-1">
            <p className="text-text-700 text-[16px] leading-[1.6] font-bold break-keep whitespace-pre-line">
              {message}
            </p>
          </div>

          <button
            type="button"
            onClick={onAction}
            className="shrink-0 rounded-[60px] bg-white px-2 py-1 text-[13px] leading-[1.6] font-semibold text-[#5A6B7F] transition-colors active:bg-[#F4F6F9]"
          >
            확인하기
          </button>
        </div>
      </div>
    </Portal>
  );
}

export default InAppNotificationToast;
