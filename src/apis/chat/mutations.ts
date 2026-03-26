import { mutationOptions } from '@tanstack/react-query';
import { postAdminChatRoom, postChatMessage, postChatMute, postChatRooms } from '.';

export const chatMutationKeys = {
  createRoom: () => ['chat', 'createRoom'] as const,
  createAdminRoom: () => ['chat', 'createAdminRoom'] as const,
  sendMessage: () => ['chat', 'sendMessage'] as const,
  toggleMute: (chatRoomId?: number) => ['chat', 'toggleMute', chatRoomId ?? 'unknown'] as const,
};

export const chatMutations = {
  createRoom: () =>
    mutationOptions({
      mutationKey: chatMutationKeys.createRoom(),
      mutationFn: postChatRooms,
    }),
  createAdminRoom: () =>
    mutationOptions({
      mutationKey: chatMutationKeys.createAdminRoom(),
      mutationFn: postAdminChatRoom,
    }),
  sendMessage: () =>
    mutationOptions({
      mutationKey: chatMutationKeys.sendMessage(),
      mutationFn: postChatMessage,
    }),
  toggleMute: (chatRoomId?: number) =>
    mutationOptions({
      mutationKey: chatMutationKeys.toggleMute(chatRoomId),
      mutationFn: async () => {
        if (!chatRoomId) {
          throw new Error('chatRoomId is missing');
        }

        return postChatMute(chatRoomId);
      },
    }),
};
