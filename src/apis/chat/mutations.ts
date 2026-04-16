import { mutationOptions } from '@tanstack/react-query';
import {
  patchChatRoomName,
  postChatRoomsGroup,
  postAdminChatRoom,
  postChatMessage,
  postChatMute,
  postChatRooms,
  deleteChatRoom,
} from '@/apis/chat';

export const chatMutationKeys = {
  createRoom: () => ['chat', 'createRoom'] as const,
  createAdminRoom: () => ['chat', 'createAdminRoom'] as const,
  createRoomGroup: () => ['chat', 'createRoomGroup'] as const,
  sendMessage: () => ['chat', 'sendMessage'] as const,
  toggleMute: (chatRoomId?: number) => ['chat', 'toggleMute', chatRoomId ?? 'unknown'] as const,
  updateRoomName: () => ['chat', 'updateRoomName'] as const,
  deleteRoom: () => ['chat', 'deleteRoom'] as const,
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
  createRoomGroup: () =>
    mutationOptions({
      mutationKey: chatMutationKeys.createRoomGroup(),
      mutationFn: postChatRoomsGroup,
    }),
  sendMessage: () =>
    mutationOptions({
      mutationKey: chatMutationKeys.sendMessage(),
      mutationFn: postChatMessage,
    }),
  toggleMute: () =>
    mutationOptions({
      mutationKey: chatMutationKeys.toggleMute(),
      mutationFn: async (chatRoomId?: number) => {
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
  deleteRoom: () =>
    mutationOptions({
      mutationKey: chatMutationKeys.deleteRoom(),
      mutationFn: (chatRoomId: number) => deleteChatRoom(chatRoomId),
    }),
};
