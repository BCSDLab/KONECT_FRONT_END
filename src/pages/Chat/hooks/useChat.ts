import { useInfiniteQuery, useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { chatQueries } from '@/apis/chat/queries';
import { clubQueries } from '@/apis/club/queries';
import {
  useCreateChatRoomMutation,
  useCreateChatRoomGroupMutation,
  useSendChatMessageMutation,
  useToggleChatMuteMutation,
  useUpdateChatRoomNameMutation,
  useDeleteChatRoomMutation,
} from '@/pages/Chat/hooks/useChatMutations';

const useChat = (chatRoomId?: number, messageId?: number) => {
  const { data: chatRoomList } = useSuspenseQuery({
    ...chatQueries.rooms(),
    refetchInterval: 5000,
  });

  const createChatRoomMutation = useCreateChatRoomMutation();

  const createRoomGroupMutation = useCreateChatRoomGroupMutation();

  const {
    data: chatMessagesData,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
  } = useInfiniteQuery({
    ...chatQueries.messages(chatRoomId, messageId),
    refetchInterval: 1000,
  });

  const allMessages = (() => {
    const messages = chatMessagesData?.pages.flatMap((page) => page.messages) ?? [];
    const seenMessageIds = new Set<number>();

    return messages.filter((message) => {
      if (seenMessageIds.has(message.messageId)) {
        return false;
      }

      seenMessageIds.add(message.messageId);
      return true;
    });
  })();

  const totalUnreadCount = chatRoomList.rooms.reduce((sum, room) => sum + room.unreadCount, 0);

  const sendMessageMutation = useSendChatMessageMutation();

  const clubId = chatMessagesData?.pages[0]?.clubId;

  const { data: clubMembersData } = useQuery(clubQueries.members(clubId));

  const toggleMuteMutation = useToggleChatMuteMutation();

  const updateRoomNameMutation = useUpdateChatRoomNameMutation();

  const deleteChatRoomMutation = useDeleteChatRoomMutation();

  return {
    chatRoomList,
    createChatRoom: createChatRoomMutation.mutateAsync,
    createRoomGroup: createRoomGroupMutation.mutateAsync,
    isCreatingChatRoom: createChatRoomMutation.isPending,
    chatMessages: allMessages,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    totalUnreadCount,
    sendMessage: sendMessageMutation.mutate,
    isSendingMessage: sendMessageMutation.isPending,
    clubMembers: clubMembersData?.clubMembers ?? [],
    toggleMute: toggleMuteMutation.mutateAsync,
    isTogglingMute: toggleMuteMutation.isPending,
    updateRoomName: updateRoomNameMutation.mutateAsync,
    isUpdatingRoomName: updateRoomNameMutation.isPending,
    deleteChatRoom: deleteChatRoomMutation.mutateAsync,
    isDeletingChatRoom: deleteChatRoomMutation.isPending,
  };
};

export default useChat;
