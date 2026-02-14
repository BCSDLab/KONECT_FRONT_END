import { apiClient } from '../client';
import type {
  ChatMessage,
  ChatMessageRequestParam,
  ChatMessagesResponse,
  ChatRoomsResponse,
  CreateChatRoomResponse,
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

export const postChatMessage = async (chatRoomId: number, content: string) => {
  const response = await apiClient.post<ChatMessage>(`chats/rooms/${chatRoomId}/messages`, {
    body: { content },
    requiresAuth: true,
  });
  return response;
};

export const getChatMessages = async (params: ChatMessageRequestParam) => {
  const response = await apiClient.get<ChatMessagesResponse, ChatMessageRequestParam>(
    `chats/rooms/${params.chatRoomId}`,
    { params, requiresAuth: true }
  );
  return response;
};
