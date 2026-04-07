import type { Room } from '@/apis/chat/entity';

export function isDirectChatType(chatType?: Room['chatType']) {
  return chatType === 'DIRECT';
}

export function isGroupChatType(chatType?: Room['chatType']) {
  return chatType != null && !isDirectChatType(chatType);
}
