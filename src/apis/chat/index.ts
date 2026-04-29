import { apiClient } from '../client';
import type {
  ChatMessage,
  ChatMessageRequestParam,
  ChatMessagesResponse,
  ChatRoomMembersResponse,
  ChatRoomsResponse,
  CreateChatRoomResponse,
  InvitableFriendsRequestParams,
  InvitableFriendsResponse,
  MatchedRequestParams,
  MatchResponse,
  SendChatMessageRequest,
} from './entity';

export const getChatRooms = async () => {
  const response = await apiClient.get<ChatRoomsResponse>('chats/rooms', {
    requiresAuth: true,
  });
  return response;
};

export const postChatRooms = async (userId: number) => {
  const response = await apiClient.post<CreateChatRoomResponse>('chats/rooms', {
    body: { userId },
    requiresAuth: true,
  });
  return response;
};

export const postChatRoomsGroup = async (userIds: number[]) => {
  const response = await apiClient.post<CreateChatRoomResponse>('chats/rooms/group', {
    body: { userIds },
    requiresAuth: true,
  });
  return response;
};

export const getChatRoomMembers = async (chatRoomId: number) => {
  const response = await apiClient.get<ChatRoomMembersResponse>(`chats/rooms/${chatRoomId}/members`, {
    requiresAuth: true,
  });
  return response;
};

export const postChatRoomMembers = async (chatRoomId: number, userIds: number[]) => {
  const response = await apiClient.post<void>(`chats/rooms/${chatRoomId}/members`, {
    body: { userIds },
    requiresAuth: true,
  });
  return response;
};

export const postChatMessage = async ({ chatRoomId, content }: SendChatMessageRequest) => {
  return apiClient.post<ChatMessage>(`chats/rooms/${chatRoomId}/messages`, {
    body: { content },
    requiresAuth: true,
  });
};

export const getChatMessages = async ({ chatRoomId, ...query }: ChatMessageRequestParam) => {
  return apiClient.get<ChatMessagesResponse, Omit<ChatMessageRequestParam, 'chatRoomId'>>(`chats/rooms/${chatRoomId}`, {
    params: query,
    requiresAuth: true,
  });
};

export const postChatMute = async (chatRoomId: number) => {
  return apiClient.post<{ isMuted: boolean }>(`chats/rooms/${chatRoomId}/mute`, {
    requiresAuth: true,
  });
};

export const postAdminChatRoom = async () => {
  const response = await apiClient.post<CreateChatRoomResponse>('chats/rooms/admin', {
    requiresAuth: true,
  });
  return response;
};

export const patchChatRoomName = async (chatRoomId: number, name: string) => {
  const response = await apiClient.patch(`chats/rooms/${chatRoomId}/name`, {
    body: { roomName: name },
    requiresAuth: true,
  });
  return response;
};

export const deleteChatRoom = async (chatRoomId: number) => {
  const response = await apiClient.delete(`chats/rooms/${chatRoomId}`, {
    requiresAuth: true,
  });
  return response;
};

export const getSearchChat = async ({ ...query }: MatchedRequestParams) => {
  const response = await apiClient.get<MatchResponse>(`chats/rooms/search`, {
    params: query,
    requiresAuth: true,
  });
  return response;
};

export const getInvitableFriends = async ({ ...query }: InvitableFriendsRequestParams) => {
  const response = await apiClient.get<InvitableFriendsResponse>('chats/rooms/invitables', {
    params: query,
    requiresAuth: true,
  });
  return response;
};
