import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import type { ChatMessagesResponse } from './entity';
import { getChatMessages, getChatRooms } from '.';

export const chatQueryKeys = {
  all: ['chat'] as const,
  rooms: () => [...chatQueryKeys.all, 'rooms'] as const,
  messages: (chatRoomId: number) => [...chatQueryKeys.all, 'messages', chatRoomId] as const,
  disabledMessages: () => [...chatQueryKeys.all, 'messages', 'disabled'] as const,
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
};
