import { useEffect, useRef } from 'react';
import { useMutation, useSuspenseQuery, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { getChatMessages, getChatRooms, postChatMessage, postChatRooms } from '@/apis/chat';
import type { ChatRoomsResponse } from '@/apis/chat/entity';

const useChat = (chatRoomId?: number) => {
  const queryClient = useQueryClient();

  const { data: chatRoomList } = useSuspenseQuery({
    queryKey: ['chatList'],
    queryFn: () => getChatRooms(),
    refetchInterval: 5000,
  });

  const { mutateAsync: createChatRoom } = useMutation({
    mutationKey: ['createChatRoom'],
    mutationFn: (clubId: number) => postChatRooms(clubId),
  });

  const {
    data: chatMessagesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isSuccess,
  } = useInfiniteQuery({
    queryKey: ['chatMessages', chatRoomId],
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

  const totalUnreadCount = chatRoomList.chatRooms.reduce((sum, room) => sum + room.unreadCount, 0);

  useEffect(() => {
    if (!chatRoomId) return;
    if (!isSuccess) return;

    if (markedReadRoomRef.current === chatRoomId) return;
    markedReadRoomRef.current = chatRoomId;

    queryClient.setQueryData<ChatRoomsResponse>(['chatList'], (old) => {
      if (!old) return old;

      const nextRooms = old.chatRooms.map((room) =>
        room.chatRoomId === chatRoomId ? { ...room, unreadCount: 0 } : room
      );

      return { ...old, chatRooms: nextRooms };
    });
  }, [chatRoomId, isSuccess, queryClient]);

  const { mutateAsync: sendMessage } = useMutation({
    mutationKey: ['sendMessage', chatRoomId],
    mutationFn: ({ chatRoomId, content }: { chatRoomId: number; content: string }) =>
      postChatMessage(chatRoomId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatMessages', chatRoomId] });
      queryClient.invalidateQueries({ queryKey: ['chatList'] });
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
