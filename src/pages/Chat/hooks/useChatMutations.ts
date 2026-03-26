import { useMutation, useQueryClient } from '@tanstack/react-query';
import { chatMutations } from '@/apis/chat/mutations';

export const useCreateChatRoomMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(chatMutations.createRoom(queryClient));
};

export const useSendChatMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation(chatMutations.sendMessage(queryClient));
};

export const useToggleChatMuteMutation = (chatRoomId?: number) => {
  const queryClient = useQueryClient();

  return useMutation(chatMutations.toggleMute(queryClient, chatRoomId));
};
