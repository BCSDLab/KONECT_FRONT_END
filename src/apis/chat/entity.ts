import type { PaginationParams, PaginationResponse } from '../common/pagination';

interface ChatRoom {
  chatRoomId: number;
  chatPartnerName: string;
  chatPartnerProfileImage: string;
  lastMessage?: string;
  lastSentTime?: string;
  unreadCount: number;
}

export interface ChatRoomsResponse {
  chatRooms: ChatRoom[];
}

export interface ChatMessage {
  messageId: number;
  senderId: number;
  content: string;
  createdAt: string;
  isRead: boolean;
  isMine: boolean;
}

export interface ChatMessageRequestParam extends PaginationParams {
  chatRoomId: number;
}

export interface ChatMessagesResponse extends PaginationResponse {
  messages: ChatMessage[];
}

export interface CreateChatRoomResponse {
  chatRoomId: number;
}
