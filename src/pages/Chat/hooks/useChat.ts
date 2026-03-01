import { useMutation, useSuspenseQuery, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { getChatMessages, getChatRooms, postChatMessage, postChatRooms, postChatMute } from '@/apis/chat';
import { useGetClubMembers } from '@/pages/Club/ClubDetail/hooks/useGetClubMembers';

export const chatQueryKeys = {
  all: ['chat'] as const,
  rooms: () => [...chatQueryKeys.all, 'rooms'] as const,
  messages: (chatRoomId: number) => [...chatQueryKeys.all, 'messages', chatRoomId] as const,
};

const useChat = (chatRoomId?: number) => {
  const queryClient = useQueryClient();

  const { data: chatRoomList } = useSuspenseQuery({
    queryKey: chatQueryKeys.rooms(),
    queryFn: getChatRooms,
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
  } = useInfiniteQuery({
    queryKey: chatRoomId ? chatQueryKeys.messages(chatRoomId) : ['chat', 'messages', 'disabled'],

    enabled: !!chatRoomId,

    queryFn: ({ pageParam }) =>
      getChatMessages({
        chatRoomId: chatRoomId!,
        page: pageParam,
        limit: 20,
      }),

    initialPageParam: 1,

    getNextPageParam: (lastPage) => (lastPage.currentPage < lastPage.totalPage ? lastPage.currentPage + 1 : undefined),

    refetchInterval: 1000,
  });

  const allMessages = chatMessagesData?.pages.flatMap((page) => page.messages) ?? [];

  const totalUnreadCount = chatRoomList.rooms.reduce((sum, room) => sum + room.unreadCount, 0);

  const { mutate: sendMessage } = useMutation({
    mutationKey: ['sendMessage', chatRoomId],
    mutationFn: postChatMessage,

    onSuccess: () => {
      if (!chatRoomId) return;
      queryClient.invalidateQueries({
        queryKey: chatQueryKeys.messages(chatRoomId),
      });
      queryClient.invalidateQueries({
        queryKey: chatQueryKeys.rooms(),
      });
    },
  });

  const clubId = chatMessagesData?.pages[0]?.clubId;

  const { data: clubMembersData } = useGetClubMembers(clubId);

  const { mutateAsync: toggleMute } = useMutation({
    mutationKey: ['toggleMute', chatRoomId],
    mutationFn: async () => {
      if (!chatRoomId) {
        throw new Error('chatRoomId is missing');
      }

      return postChatMute(chatRoomId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: chatQueryKeys.rooms(),
      });
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
    clubMembers: clubMembersData?.clubMembers ?? [],
    toggleMute,
  };
};

export default useChat;
