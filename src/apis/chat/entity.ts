import type { PaginationParams, PaginationResponse } from '../common/pagination';

export interface Room {
  roomId: number;
  chatType: 'DIRECT' | 'GROUP';
  roomName: string;
  roomImageUrl: string;
  lastMessage: string | null;
  lastSentAt: string | null;
  unreadCount: number;
}

export interface ChatRoomsResponse {
  rooms: Room[];
}

export interface ChatMessage {
  messageId: number;
  senderId: number;
  senderName: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  unreadCount: number;
  isMine: boolean;
}

export interface ChatMessageRequestParam extends PaginationParams {
  chatRoomId: number;
  type: 'DIRECT' | 'GROUP';
}

export interface ChatMessagesResponse extends PaginationResponse {
  messages: ChatMessage[];
}

export interface CreateChatRoomResponse {
  chatRoomId: number;
}
