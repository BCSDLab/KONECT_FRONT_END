import type { InboxNotification, NotificationInboxType } from '@/apis/notification/entity';

export type InboxNotificationTone = 'default' | 'success';
export type InboxNotificationIconKind = 'person' | 'chat';
export type InboxNotificationToastVariant = 'general' | 'approved';

interface InboxNotificationPresentation {
  tone: InboxNotificationTone;
  iconKind: InboxNotificationIconKind;
  toastVariant: InboxNotificationToastVariant;
}

const DEFAULT_NOTIFICATION_PRESENTATION: InboxNotificationPresentation = {
  tone: 'default',
  iconKind: 'person',
  toastVariant: 'general',
};

const NOTIFICATION_PRESENTATIONS = {
  CLUB_APPLICATION_SUBMITTED: {
    tone: 'default',
    iconKind: 'person',
    toastVariant: 'general',
  },
  CLUB_APPLICATION_APPROVED: {
    tone: 'success',
    iconKind: 'person',
    toastVariant: 'approved',
  },
  CLUB_APPLICATION_REJECTED: {
    tone: 'default',
    iconKind: 'person',
    toastVariant: 'general',
  },
  CHAT_MESSAGE: {
    tone: 'default',
    iconKind: 'chat',
    toastVariant: 'general',
  },
  GROUP_CHAT_MESSAGE: {
    tone: 'default',
    iconKind: 'chat',
    toastVariant: 'general',
  },
  UNREAD_CHAT_COUNT: {
    tone: 'default',
    iconKind: 'chat',
    toastVariant: 'general',
  },
} satisfies Record<NotificationInboxType, InboxNotificationPresentation>;

function isNotificationInboxType(value: string): value is NotificationInboxType {
  return Object.hasOwn(NOTIFICATION_PRESENTATIONS, value);
}

export function getInboxNotificationPresentation(notification: InboxNotification): InboxNotificationPresentation {
  if (isNotificationInboxType(notification.type)) {
    return NOTIFICATION_PRESENTATIONS[notification.type];
  }

  return DEFAULT_NOTIFICATION_PRESENTATION;
}

export function getInboxNotificationMessage(notification: InboxNotification): string {
  return notification.body.trim() || notification.title.trim() || '새 알림이 도착했어요.';
}

export function getInboxNotificationTone(notification: InboxNotification): InboxNotificationTone {
  return getInboxNotificationPresentation(notification).tone;
}

export function getInboxNotificationIconKind(notification: InboxNotification): InboxNotificationIconKind {
  return getInboxNotificationPresentation(notification).iconKind;
}

export function getInboxNotificationToastVariant(notification: InboxNotification): InboxNotificationToastVariant {
  return getInboxNotificationPresentation(notification).toastVariant;
}

export function normalizeInboxNotificationPath(path: string): string | null {
  const normalizedPath = path.trim();

  if (
    !normalizedPath ||
    normalizedPath.startsWith('//') ||
    normalizedPath.includes('://') ||
    /^[a-zA-Z][\w+.-]*:/.test(normalizedPath)
  ) {
    return null;
  }

  return normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
}
