import { mutationOptions } from '@tanstack/react-query';
import { patchChatRoomName, postAdminChatRoom, postChatMessage, postChatMute, postChatRooms } from '@/apis/chat';

export const chatMutationKeys = {
  createRoom: () => ['chat', 'createRoom'] as const,
  createAdminRoom: () => ['chat', 'createAdminRoom'] as const,
  sendMessage: () => ['chat', 'sendMessage'] as const,
  toggleMute: (chatRoomId?: number) => ['chat', 'toggleMute', chatRoomId ?? 'unknown'] as const,
  updateRoomName: () => ['chat', 'updateRoomName'] as const,
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
  updateRoomName: () =>
    mutationOptions({
      mutationKey: chatMutationKeys.updateRoomName(),
      mutationFn: ({ chatRoomId, name }: { chatRoomId: number; name: string }) => patchChatRoomName(chatRoomId, name),
    }),
};
