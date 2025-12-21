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

export interface ChatMessageRequestParam {
  page: number;
  limit: number;
  chatRoomId: number;
}

export interface ChatMessagesResponse {
  totalCount: number;
  currentCount: number;
  totalPage: number;
  currentPage: number;
  messages: ChatMessage[];
}
