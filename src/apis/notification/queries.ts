import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import { getInboxNotifications, getInboxUnreadCount, getNotificationToken } from '.';

export const notificationQueryKeys = {
  all: ['notifications'] as const,
  token: () => [...notificationQueryKeys.all, 'token'] as const,
  inbox: {
    all: () => [...notificationQueryKeys.all, 'inbox'] as const,
    list: () => [...notificationQueryKeys.inbox.all(), 'list'] as const,
    infinite: () => [...notificationQueryKeys.inbox.list(), 'infinite'] as const,
    unreadCount: () => [...notificationQueryKeys.inbox.all(), 'unread-count'] as const,
  },
};

export const notificationQueries = {
  token: () =>
    queryOptions({
      queryKey: notificationQueryKeys.token(),
      queryFn: getNotificationToken,
      retry: false,
    }),
  inboxUnreadCount: () =>
    queryOptions({
      queryKey: notificationQueryKeys.inbox.unreadCount(),
      queryFn: getInboxUnreadCount,
    }),
  inboxInfinite: () =>
    infiniteQueryOptions({
      queryKey: notificationQueryKeys.inbox.infinite(),
      queryFn: ({ pageParam = 1 }) => getInboxNotifications(pageParam),
      initialPageParam: 1,
      getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.currentPage + 1 : undefined),
    }),
};
