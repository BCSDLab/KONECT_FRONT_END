import { useMutation, useQueryClient } from '@tanstack/react-query';
import { chatMutations } from './mutations';
import { chatQueryKeys } from './queries';
import type { SendChatMessageRequest } from './entity';

export const useCreateChatRoomMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    ...chatMutations.createRoom(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: chatQueryKeys.rooms() });
    },
  });
};

export const useSendChatMessageMutation = (chatRoomId?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...chatMutations.sendMessage(chatRoomId),
    onSuccess: async (_, variables: SendChatMessageRequest) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: chatQueryKeys.messages(variables.chatRoomId),
        }),
        queryClient.invalidateQueries({
          queryKey: chatQueryKeys.rooms(),
        }),
      ]);
    },
  });
};

export const useToggleChatMuteMutation = (chatRoomId?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...chatMutations.toggleMute(chatRoomId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: chatQueryKeys.rooms(),
      });
    },
  });
};
