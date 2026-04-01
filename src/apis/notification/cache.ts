import type {
  InboxNotification,
  InboxNotificationListResponse,
  InboxNotificationUnreadCountResponse,
} from '@/apis/notification/entity';
import type { InfiniteData } from '@tanstack/react-query';

function hasInboxNotification(previousData: InfiniteData<InboxNotificationListResponse>, notificationId: number) {
  return previousData.pages.some((page) =>
    page.notifications.some((notification) => notification.id === notificationId)
  );
}

export function prependInboxNotification(
  previousData: InfiniteData<InboxNotificationListResponse> | undefined,
  notification: InboxNotification
) {
  if (!previousData || hasInboxNotification(previousData, notification.id)) {
    return previousData;
  }

  const [firstPage, ...remainingPages] = previousData.pages;

  if (!firstPage) {
    return previousData;
  }

  return {
    ...previousData,
    pages: [
      {
        ...firstPage,
        notifications: [notification, ...firstPage.notifications],
        totalElements: firstPage.totalElements + 1,
      },
      ...remainingPages.map((page) => ({
        ...page,
        totalElements: page.totalElements + 1,
      })),
    ],
  };
}

export function setInboxNotificationReadState(
  previousData: InfiniteData<InboxNotificationListResponse> | undefined,
  notificationId: number
) {
  if (!previousData) {
    return previousData;
  }

  return {
    ...previousData,
    pages: previousData.pages.map((page) => ({
      ...page,
      notifications: page.notifications.map((notification) =>
        notification.id === notificationId ? { ...notification, isRead: true } : notification
      ),
    })),
  };
}

export function incrementInboxUnreadCount(previousData: InboxNotificationUnreadCountResponse | undefined, count = 1) {
  return {
    unreadCount: Math.max((previousData?.unreadCount ?? 0) + count, 0),
  };
}

export function decrementInboxUnreadCount(previousData: InboxNotificationUnreadCountResponse | undefined, count = 1) {
  if (!previousData) {
    return previousData;
  }

  return {
    unreadCount: Math.max(previousData.unreadCount - count, 0),
  };
}
