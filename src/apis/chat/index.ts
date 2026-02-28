import { apiClient } from '../client';
import type {
  ChatMessage,
  ChatMessageRequestParam,
  ChatMessagesResponse,
  ChatRoomsResponse,
  CreateChatRoomResponse,
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
