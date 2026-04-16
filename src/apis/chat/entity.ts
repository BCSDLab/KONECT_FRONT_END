import type { PaginationParams, PaginationResponse } from '@/apis/common/pagination';

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
  messageId?: number;
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
  matchedMessageId: number;
  unreadCount: number;
  isMuted: boolean;
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

export interface InvitableUser {
  userId: number;
  name: string;
  imageUrl: string;
  studentNumber: string;
}

export interface InvitableSection {
  clubId: number;
  clubName: string;
  users: InvitableUser[];
}

export interface InvitableFriendsRequestParams extends PaginationParams {
  query: string;
  sortBy: SortBy;
}

interface InvitableFriendsBase extends PaginationResponse {
  sortBy: SortBy;
}

export interface GroupedInvitableFriendsResponse extends InvitableFriendsBase {
  sortBy: 'CLUB';
  grouped: true;
  users: [];
  sections: InvitableSection[];
}

export interface FlatInvitableFriendsResponse extends InvitableFriendsBase {
  sortBy: 'NAME';
  grouped: false;
  users: InvitableUser[];
  sections: [];
}

export type InvitableFriendsResponse = GroupedInvitableFriendsResponse | FlatInvitableFriendsResponse;
