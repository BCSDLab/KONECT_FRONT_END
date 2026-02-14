import { useEffect, useRef } from 'react';
import { useMutation, useSuspenseQuery, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { getChatMessages, getChatRooms, postChatMessage, postChatRooms } from '@/apis/chat';
import type { ChatRoomsResponse } from '@/apis/chat/entity';

export const chatQueryKeys = {
  all: ['chat'],
  rooms: () => [...chatQueryKeys.all, 'rooms'],
  messages: (chatRoomId: number) => [...chatQueryKeys.all, 'messages', chatRoomId],
};

const useChat = (chatRoomId?: number) => {
  const queryClient = useQueryClient();

  const { data: chatRoomList } = useSuspenseQuery({
    queryKey: chatQueryKeys.rooms(),
    queryFn: () => getChatRooms(),
    refetchInterval: 5000,
  });

  const { mutateAsync: createChatRoom } = useMutation({
    mutationKey: ['createChatRoom'],
    mutationFn: (userId: number) => postChatRooms(userId),
  });

  const {
    data: chatMessagesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isSuccess,
  } = useInfiniteQuery({
    queryKey: chatQueryKeys.messages(chatRoomId!),
    queryFn: ({ pageParam }) =>
      getChatMessages({
        chatRoomId: chatRoomId!,
        page: pageParam,
        limit: 20,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.currentPage < lastPage.totalPage ? lastPage.currentPage + 1 : undefined),
    enabled: !!chatRoomId,
    refetchInterval: 1000,
  });

  const allMessages = chatMessagesData?.pages.flatMap((page) => page.messages) ?? [];

  const markedReadRoomRef = useRef<number | null>(null);

  const totalUnreadCount = chatRoomList.rooms.reduce((sum, room) => sum + room.unreadCount, 0);

  useEffect(() => {
    if (!chatRoomId) return;
    if (!isSuccess) return;

    if (markedReadRoomRef.current === chatRoomId) return;
    markedReadRoomRef.current = chatRoomId;

    queryClient.setQueryData<ChatRoomsResponse>(chatQueryKeys.rooms(), (old) => {
      if (!old) return old;

      const nextRooms = old.rooms.map((room) => (room.roomId === chatRoomId ? { ...room, unreadCount: 0 } : room));

      return { ...old, rooms: nextRooms };
    });
  }, [chatRoomId, isSuccess, queryClient]);

  const { mutateAsync: sendMessage } = useMutation({
    mutationKey: ['sendMessage', chatRoomId],
    mutationFn: ({ chatRoomId, content }: { chatRoomId: number; content: string }) =>
      postChatMessage(chatRoomId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: chatQueryKeys.messages(chatRoomId!) });
      queryClient.invalidateQueries({ queryKey: chatQueryKeys.rooms() });
    },
  });

  return {
    chatRoomList,
    createChatRoom,
    chatMessages: allMessages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    totalUnreadCount,
    sendMessage,
  };
};

export default useChat;
