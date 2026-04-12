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

const useChat = (chatRoomId?: number) => {
  const { data: chatRoomList } = useSuspenseQuery({
    ...chatQueries.rooms(),
    refetchInterval: 5000,
  });

  const createChatRoomMutation = useCreateChatRoomMutation();

  const createRoomGroupMutation = useCreateChatRoomGroupMutation();

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
    hasNextPage,
    isFetchingNextPage,
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
