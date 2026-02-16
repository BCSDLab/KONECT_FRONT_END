import { useMemo } from 'react';
import { useMutation, useSuspenseQuery, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { getChatMessages, getChatRooms, postChatMessage, postChatRooms } from '@/apis/chat';
import { useGetClubMembers } from '@/pages/Club/ClubDetail/hooks/useGetClubMembers';

type ChatType = 'DIRECT' | 'GROUP';

export const chatQueryKeys = {
  all: ['chat'] as const,
  rooms: () => [...chatQueryKeys.all, 'rooms'] as const,
  messages: (chatRoomId: number, type: ChatType) => [...chatQueryKeys.all, 'messages', chatRoomId, type] as const,
};

const useChat = (chatRoomId?: number) => {
  const queryClient = useQueryClient();

  const { data: chatRoomList } = useSuspenseQuery({
    queryKey: chatQueryKeys.rooms(),
    queryFn: getChatRooms,
    refetchInterval: 5000,
  });

  const currentRoomType: ChatType | undefined = useMemo(() => {
    if (!chatRoomId) return undefined;
    return chatRoomList.rooms.find((room) => room.roomId === chatRoomId)?.chatType;
  }, [chatRoomId, chatRoomList.rooms]);

  const { mutateAsync: createChatRoom } = useMutation({
    mutationKey: ['createChatRoom'],
    mutationFn: (userId: number) => postChatRooms(userId),
  });

  const {
    data: chatMessagesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey:
      chatRoomId && currentRoomType
        ? chatQueryKeys.messages(chatRoomId, currentRoomType)
        : ['chat', 'messages', 'disabled'],

    enabled: !!chatRoomId && !!currentRoomType,

    queryFn: ({ pageParam }) =>
      getChatMessages({
        chatRoomId: chatRoomId!,
        type: currentRoomType!,
        page: pageParam,
        limit: 20,
      }),

    initialPageParam: 1,

    getNextPageParam: (lastPage) => (lastPage.currentPage < lastPage.totalPage ? lastPage.currentPage + 1 : undefined),

    refetchInterval: 1000,
  });

  const allMessages = chatMessagesData?.pages.flatMap((page) => page.messages) ?? [];

  const totalUnreadCount = chatRoomList.rooms.reduce((sum, room) => sum + room.unreadCount, 0);

  const { mutateAsync: sendMessage } = useMutation<
    Awaited<ReturnType<typeof postChatMessage>>,
    Error,
    { chatRoomId: number; content: string }
  >({
    mutationKey: ['sendMessage', chatRoomId],

    mutationFn: async ({ chatRoomId, content }) => {
      if (!currentRoomType) {
        throw new Error('chatType is missing');
      }

      return postChatMessage(chatRoomId, currentRoomType, content);
    },

    onSuccess: () => {
      if (!chatRoomId || !currentRoomType) return;

      queryClient.invalidateQueries({
        queryKey: chatQueryKeys.messages(chatRoomId, currentRoomType),
      });

      queryClient.invalidateQueries({
        queryKey: chatQueryKeys.rooms(),
      });
    },
  });

  const clubId = chatMessagesData?.pages[0]?.clubId;

  const { data: clubMembersData } = useGetClubMembers(clubId);

  return {
    chatRoomList,
    createChatRoom,
    chatMessages: allMessages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    totalUnreadCount,
    sendMessage,
    clubMembers: clubMembersData?.clubMembers ?? [],
  };
};

export default useChat;
