import { useMutation, useQueryClient } from '@tanstack/react-query';
import { chatMutations } from '@/apis/chat/mutations';
import { chatQueryKeys } from '@/apis/chat/queries';

export const useCreateChatRoomMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    ...chatMutations.createRoom(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: chatQueryKeys.rooms() });
    },
  });
};

export const useSendChatMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    ...chatMutations.sendMessage(),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: chatQueryKeys.messages(variables.chatRoomId) }),
        queryClient.invalidateQueries({ queryKey: chatQueryKeys.rooms() }),
      ]);
    },
  });
};

export const useUpdateChatRoomNameMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    ...chatMutations.updateRoomName(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: chatQueryKeys.rooms() });
    },
  });
};

export const useToggleChatMuteMutation = (chatRoomId?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...chatMutations.toggleMute(chatRoomId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: chatQueryKeys.rooms() });
    },
  });
};
