import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import type { ChatMessagesResponse, SortBy } from './entity';
import { getChatMessages, getChatRooms, getSearchChat, getInvitableFriends } from '.';

export const chatQueryKeys = {
  all: ['chat'] as const,
  rooms: () => [...chatQueryKeys.all, 'rooms'] as const,
  messages: (chatRoomId: number) => [...chatQueryKeys.all, 'messages', chatRoomId] as const,
  disabledMessages: () => [...chatQueryKeys.all, 'messages', 'disabled'] as const,
  search: (keyword: string) => [...chatQueryKeys.all, 'search', keyword],
  invite: (query: string, sortBy: SortBy) => [...chatQueryKeys.all, 'invite', query, sortBy],
};

export const chatQueries = {
  rooms: () =>
    queryOptions({
      queryKey: chatQueryKeys.rooms(),
      queryFn: getChatRooms,
    }),
  messages: (chatRoomId?: number, limit = 20) =>
    infiniteQueryOptions({
      queryKey: chatRoomId ? chatQueryKeys.messages(chatRoomId) : chatQueryKeys.disabledMessages(),
      queryFn: ({ pageParam }) =>
        getChatMessages({
          chatRoomId: chatRoomId!,
          page: pageParam,
          limit,
        }),
      initialPageParam: 1,
      getNextPageParam: (lastPage: ChatMessagesResponse) =>
        lastPage.currentPage < lastPage.totalPage ? lastPage.currentPage + 1 : undefined,
      enabled: Boolean(chatRoomId),
    }),
  search: (keyword: string) =>
    queryOptions({
      queryKey: chatQueryKeys.search(keyword),
      queryFn: () => getSearchChat({ keyword, page: 1, limit: 20 }),
    }),
  invite: (query: string, sortBy: SortBy) =>
    queryOptions({
      queryKey: chatQueryKeys.invite(query, sortBy),
      queryFn: () => getInvitableFriends({ query, sortBy, page: 1, limit: 20 }),
    }),
};
