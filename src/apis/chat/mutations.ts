import { mutationOptions, type QueryClient } from '@tanstack/react-query';
import { chatQueryKeys } from './queries';
import type { SendChatMessageRequest } from './entity';
import { postAdminChatRoom, postChatMessage, postChatMute, postChatRooms } from '.';

export const chatMutationKeys = {
  createRoom: () => ['chat', 'createRoom'] as const,
  createAdminRoom: () => ['chat', 'createAdminRoom'] as const,
  sendMessage: () => ['chat', 'sendMessage'] as const,
  toggleMute: (chatRoomId?: number) => ['chat', 'toggleMute', chatRoomId ?? 'unknown'] as const,
};

export const chatMutations = {
  createRoom: (queryClient: QueryClient) =>
    mutationOptions({
      mutationKey: chatMutationKeys.createRoom(),
      mutationFn: postChatRooms,
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: chatQueryKeys.rooms() });
      },
    }),
  createAdminRoom: () =>
    mutationOptions({
      mutationKey: chatMutationKeys.createAdminRoom(),
      mutationFn: postAdminChatRoom,
    }),
  sendMessage: (queryClient: QueryClient) =>
    mutationOptions({
      mutationKey: chatMutationKeys.sendMessage(),
      mutationFn: postChatMessage,
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
    }),
  toggleMute: (queryClient: QueryClient, chatRoomId?: number) =>
    mutationOptions({
      mutationKey: chatMutationKeys.toggleMute(chatRoomId),
      mutationFn: async () => {
        if (!chatRoomId) {
          throw new Error('chatRoomId is missing');
        }

        return postChatMute(chatRoomId);
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: chatQueryKeys.rooms(),
        });
      },
    }),
};
