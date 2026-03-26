import type { ComponentType, SVGProps } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import type { InboxNotification } from '@/apis/notification/entity';
import { notificationQueries, notificationQueryKeys } from '@/apis/notification/queries';
import BellOffIcon from '@/assets/svg/bell-off.svg';
import ChatIcon from '@/assets/svg/chat-icon.svg';
import PersonIcon from '@/assets/svg/person-icon.svg';
import { getBottomOverlayOffset, NOTIFICATION_LIST_BOTTOM_GAP } from '@/components/layout/layoutMetrics';
import { useMarkInboxNotificationAsReadMutation } from '@/components/notification/hooks/useInboxNotificationMutations';
import { useLayoutElementsContext } from '@/contexts/useLayoutElementsContext';
import { useInfiniteScroll } from '@/utils/hooks/useInfiniteScroll';
import {
  getInboxNotificationIconKind,
  getInboxNotificationMessage,
  normalizeInboxNotificationPath,
} from '@/utils/ts/notification';

interface NotificationRowIconProps {
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}

function NotificationRowIcon({ Icon }: NotificationRowIconProps) {
  return (
    <div className="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-[#E7EBEF] text-[#5A6B7F]">
      <Icon />
    </div>
  );
}

function NotificationRowSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <div className="size-10 shrink-0 animate-pulse rounded-[10px] bg-[#E7EBEF]" />
      <div className="min-w-0 flex-1">
        <div className="h-6 w-24 animate-pulse rounded bg-[#EEF2F5]" />
        <div className="mt-1.5 h-5 w-44 animate-pulse rounded bg-[#EEF2F5]" />
      </div>
    </div>
  );
}

function getNotificationListIcon(notification: InboxNotification) {
  if (getInboxNotificationIconKind(notification) === 'chat') {
    return ChatIcon;
  }

  return PersonIcon;
}

interface NotificationRowProps {
  notification: InboxNotification;
  disabled?: boolean;
  onClick: (notification: InboxNotification) => void;
}

function NotificationRow({ notification, disabled = false, onClick }: NotificationRowProps) {
  const Icon = getNotificationListIcon(notification);

  return (
    <button
      type="button"
      onClick={() => onClick(notification)}
      disabled={disabled}
      className="flex w-full items-center gap-3 rounded-xl text-left transition-colors active:bg-[#F7F9FB] disabled:cursor-not-allowed"
    >
      <NotificationRowIcon Icon={Icon} />

      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[16px] leading-[1.6] font-semibold text-[#021730]">{notification.title}</p>
          <p className="truncate text-[14px] leading-[1.6] font-medium text-[#5A6B7F]">
            {getInboxNotificationMessage(notification)}
          </p>
        </div>

        <div className="flex h-6 w-2 shrink-0 items-center justify-center">
          {!notification.isRead && <span className="size-2 rounded-full bg-[#69BFDF]" aria-hidden="true" />}
        </div>
      </div>
    </button>
  );
}

function NotificationsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { bottomOverlayInset } = useLayoutElementsContext();
  const { data, error, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery(
    notificationQueries.inboxInfinite()
  );
  const { mutateAsync: markAsRead, isPending: isMarkingAsRead } = useMarkInboxNotificationAsReadMutation();
  const observerRef = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage, { threshold: 0.3 });

  if (error) {
    throw error;
  }

  const notifications = data?.pages.flatMap((page) => page.notifications) ?? [];
  const bottomSpacerHeight = getBottomOverlayOffset(bottomOverlayInset, NOTIFICATION_LIST_BOTTOM_GAP);

  const handleNotificationClick = async (notification: InboxNotification) => {
    const destinationPath = normalizeInboxNotificationPath(notification.path);

    try {
      if (!notification.isRead) {
        await markAsRead({ notificationId: notification.id, isRead: notification.isRead });
      }
    } catch {
      void queryClient.invalidateQueries({ queryKey: notificationQueryKeys.inbox.all() });
    }

    if (destinationPath) {
      navigate(destinationPath);
    }
  };

  return (
    <div className="flex min-h-full flex-col bg-[#F4F6F9] px-5 pt-[18px] pb-6">
      <section className="rounded-2xl bg-white px-5 pt-5 pb-5 shadow-[0_0_20px_rgba(0,0,0,0.03)]">
        {isLoading ? (
          <div className="flex flex-col gap-5">
            <NotificationRowSkeleton />
            <NotificationRowSkeleton />
            <NotificationRowSkeleton />
            <NotificationRowSkeleton />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex min-h-80 flex-col items-center justify-center px-4 text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-[#F4F6F9] text-[#8497AA]">
              <BellOffIcon className="size-7" />
            </div>
            <p className="text-[18px] leading-[1.6] font-semibold text-[#021730]">도착한 알림이 없어요</p>
            <p className="mt-1 text-[14px] leading-[1.6] font-medium text-[#5A6B7F]">
              새로운 활동이 생기면 이곳에서 바로 확인할 수 있어요.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {notifications.map((notification) => (
              <NotificationRow
                key={notification.id}
                notification={notification}
                disabled={isMarkingAsRead}
                onClick={(nextNotification) => void handleNotificationClick(nextNotification)}
              />
            ))}

            {hasNextPage && (
              <div
                ref={observerRef}
                className="flex h-16 items-center justify-center text-[13px] leading-[1.6] font-medium text-[#8497AA]"
              >
                {isFetchingNextPage ? '알림을 불러오는 중입니다.' : ''}
              </div>
            )}
          </div>
        )}
      </section>
      {notifications.length > 0 && (
        <div aria-hidden="true" className="shrink-0" style={{ height: bottomSpacerHeight }} />
      )}
    </div>
  );
}

export default NotificationsPage;
