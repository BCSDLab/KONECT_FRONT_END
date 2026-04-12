import type { PaginationParams, PaginationResponse } from '../common/pagination';

export type ChatType = 'DIRECT' | 'CLUB_GROUP' | 'GROUP' | 'INQUIRY';
export type SortBy = 'CLUB' | 'NAME';

export interface Room {
  roomId: number;
  chatType: ChatType;
  roomName: string;
  roomImageUrl: string;
  lastMessage: string | null;
  lastSentAt: string | null;
  unreadCount: number;
  isMuted: boolean;
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

export interface SendChatMessageRequest {
  chatRoomId: number;
  content: string;
}

export interface ChatMessageRequestParam extends PaginationParams {
  chatRoomId: number;
}

export interface ChatMessagesResponse extends PaginationResponse {
  messages: ChatMessage[];
  clubId?: number;
}

export interface CreateChatRoomResponse {
  chatRoomId: number;
}

export interface Messages {
  roomId: number;
  chatType: ChatType;
  roomName: string;
  roomImageUrl: string;
  matchedMessage: string;
  matchedMessageSentAt: string;
}

export interface RoomMatched extends PaginationResponse {
  rooms?: Room[];
}

export interface MessageMatched extends PaginationResponse {
  messages?: Messages[];
}

export interface MatchedRequestParams extends PaginationParams {
  keyword: string;
}

export interface MatchResponse {
  roomMatches?: RoomMatched;
  messageMatches?: MessageMatched;
}

export interface User {
  userId: number;
  name: string;
  imageUrl: string;
  studentNumber: string;
}

export interface Section {
  clubId: number;
  clubName: string;
  users: User[];
}

export interface InvitableFriendRequestParams extends PaginationParams {
  query: string;
  sortBy: SortBy;
}

export interface InvitableFriend extends PaginationResponse {
  sortBy: SortBy;
  grouped: boolean;
  users?: User[];
  sections?: Section[];
}
