export type NotificationInboxType =
  | 'CLUB_APPLICATION_SUBMITTED'
  | 'CLUB_APPLICATION_APPROVED'
  | 'CLUB_APPLICATION_REJECTED'
  | 'CHAT_MESSAGE'
  | 'GROUP_CHAT_MESSAGE'
  | 'UNREAD_CHAT_COUNT';

export type InboxNotificationType = NotificationInboxType | (string & {});

export interface InboxNotification {
  id: number;
  type: InboxNotificationType;
  title: string;
  body: string;
  path: string;
  isRead: boolean;
  createdAt: string;
}

export interface InboxNotificationListResponse {
  notifications: InboxNotification[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
}

export interface InboxNotificationUnreadCountResponse {
  unreadCount: number;
}
