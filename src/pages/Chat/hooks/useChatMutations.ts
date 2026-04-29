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

export const useCreateChatRoomGroupMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    ...chatMutations.createRoomGroup(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: chatQueryKeys.rooms() });
    },
  });
};

export const useInviteChatRoomMembersMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    ...chatMutations.inviteMembers(),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: chatQueryKeys.members(variables.chatRoomId) }),
        queryClient.invalidateQueries({ queryKey: chatQueryKeys.rooms() }),
      ]);
    },
  });
};

export const useSendChatMessageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    ...chatMutations.sendMessage(),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: chatQueryKeys.messagesByRoom(variables.chatRoomId) }),
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

export const useToggleChatMuteMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    ...chatMutations.toggleMute(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: chatQueryKeys.rooms() });
    },
  });
};

export const useDeleteChatRoomMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    ...chatMutations.deleteRoom(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: chatQueryKeys.rooms() });
    },
  });
};
