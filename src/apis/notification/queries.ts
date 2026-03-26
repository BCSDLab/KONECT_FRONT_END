export const notificationQueryKeys = {
  all: ['notifications'] as const,
  inbox: {
    all: () => [...notificationQueryKeys.all, 'inbox'] as const,
    list: () => [...notificationQueryKeys.inbox.all(), 'list'] as const,
    infinite: () => [...notificationQueryKeys.inbox.list(), 'infinite'] as const,
    unreadCount: () => [...notificationQueryKeys.inbox.all(), 'unread-count'] as const,
  },
};
