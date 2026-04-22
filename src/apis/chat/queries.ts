import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import { getChatMessages, getChatRooms, getSearchChat, getInvitableFriends } from '@/apis/chat';
import type { ChatMessagesResponse, SortBy } from '@/apis/chat/entity';

interface ChatMessagesPageParam {
  page: number;
  useMessageId: boolean;
}

export const chatQueryKeys = {
  all: ['chat'] as const,
  rooms: () => [...chatQueryKeys.all, 'rooms'] as const,
  messagesByRoom: (chatRoomId: number) => [...chatQueryKeys.all, 'messages', chatRoomId] as const,
  messages: (chatRoomId: number, messageId?: number) =>
    [...chatQueryKeys.messagesByRoom(chatRoomId), messageId ?? 'latest'] as const,
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
  messages: (chatRoomId?: number, messageId?: number, limit = 20) =>
    infiniteQueryOptions({
      queryKey: chatRoomId ? chatQueryKeys.messages(chatRoomId, messageId) : chatQueryKeys.disabledMessages(),
      queryFn: ({ pageParam }) => {
        if (chatRoomId == null) {
          throw new Error('채팅방 ID가 필요합니다.');
        }

        return getChatMessages({
          chatRoomId,
          messageId: pageParam.useMessageId ? messageId : undefined,
          page: pageParam.page,
          limit,
        });
      },
      initialPageParam: { page: 1, useMessageId: messageId != null } satisfies ChatMessagesPageParam,
      getNextPageParam: (lastPage: ChatMessagesResponse) =>
        lastPage.currentPage < lastPage.totalPage
          ? ({ page: lastPage.currentPage + 1, useMessageId: false } satisfies ChatMessagesPageParam)
          : undefined,
      getPreviousPageParam: (firstPage: ChatMessagesResponse) =>
        firstPage.currentPage > 1
          ? ({ page: firstPage.currentPage - 1, useMessageId: false } satisfies ChatMessagesPageParam)
          : undefined,
      enabled: chatRoomId != null,
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
