import { useInfiniteQuery, useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { useCreateChatRoomMutation, useSendChatMessageMutation, useToggleChatMuteMutation } from '@/apis/chat/hooks';
import { chatQueries } from '@/apis/chat/queries';
import { clubQueries } from '@/apis/club/queries';

const useChat = (chatRoomId?: number) => {
  const { data: chatRoomList } = useSuspenseQuery({
    ...chatQueries.rooms(),
    refetchInterval: 5000,
  });

  const createChatRoomMutation = useCreateChatRoomMutation();

  const {
    data: chatMessagesData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    ...chatQueries.messages(chatRoomId),
    refetchInterval: 1000,
  });

  const allMessages = chatMessagesData?.pages.flatMap((page) => page.messages) ?? [];

  const totalUnreadCount = chatRoomList.rooms.reduce((sum, room) => sum + room.unreadCount, 0);

  const sendMessageMutation = useSendChatMessageMutation(chatRoomId);

  const clubId = chatMessagesData?.pages[0]?.clubId;

  const { data: clubMembersData } = useQuery(clubQueries.members(clubId));

  const toggleMuteMutation = useToggleChatMuteMutation(chatRoomId);

  return {
    chatRoomList,
    createChatRoom: createChatRoomMutation.mutateAsync,
    isCreatingChatRoom: createChatRoomMutation.isPending,
    chatMessages: allMessages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    totalUnreadCount,
    sendMessage: sendMessageMutation.mutate,
    isSendingMessage: sendMessageMutation.isPending,
    clubMembers: clubMembersData?.clubMembers ?? [],
    toggleMute: toggleMuteMutation.mutateAsync,
    isTogglingMute: toggleMuteMutation.isPending,
  };
};

export default useChat;
