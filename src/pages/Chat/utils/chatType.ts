import type { Room } from '@/apis/chat/entity';

const normalizeChatType = (chatType?: Room['chatType']) => chatType?.toUpperCase();

export function isInquiryChatType(chatType?: Room['chatType']) {
  return normalizeChatType(chatType) === 'INQUIRY';
}

export function isDirectChatType(chatType?: Room['chatType']) {
  const normalizedChatType = normalizeChatType(chatType);

  return normalizedChatType === 'DIRECT' || normalizedChatType === 'INQUIRY';
}

export function isGroupChatType(chatType?: Room['chatType']) {
  const normalizedChatType = normalizeChatType(chatType);

  return normalizedChatType === 'CLUB_GROUP' || normalizedChatType === 'GROUP';
}
