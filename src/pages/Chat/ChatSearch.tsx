import { useState, Fragment } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import type { Messages } from '@/apis/chat/entity';
import { chatQueries } from '@/apis/chat/queries';
import Search from '@/assets/svg/big-search-icon.svg';
import useDebouncedCallback from '@/utils/hooks/useDebounce';
import { ChatRoomAvatar, ChatRoomListItem } from './components/ChatRoomListItem';
import { formatTime } from './utils/formatTime';

function MessageListItem({ message, keyword }: { message: Messages; keyword: string }) {
  const parts = message.matchedMessage.split(keyword);
  return (
    <Link
      to={`/chats/${message.roomId}?messageId=${message.matchedMessageId}`}
      className="active:bg-indigo-5 flex touch-pan-y items-center gap-3 bg-white px-4 py-3 transition-colors select-none"
    >
      <ChatRoomAvatar roomImageUrl={message.roomImageUrl} />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-1">
            <span className="text-text-700 truncate text-[16px] leading-[1.6] font-semibold">{message.roomName}</span>
          </div>
          {message.matchedMessageSentAt && (
            <span className="text-text-500 shrink-0 text-[12px] leading-[1.6] font-normal">
              {formatTime(message.matchedMessageSentAt)}
            </span>
          )}
        </div>
        <div className="mt-0.5 flex items-center gap-3">
          <p className="text-text-500 min-w-0 flex-1 truncate text-[12px] leading-[1.6] font-normal">
            {parts.map((part, index) => (
              <Fragment key={index}>
                {part}
                {index < parts.length - 1 && <span className="font-bold text-black">{keyword}</span>}
              </Fragment>
            ))}
          </p>
        </div>
      </div>
    </Link>
  );
}

function ChatSearchResults({ keyword }: { keyword: string }) {
  const { data } = useSuspenseQuery(chatQueries.search(keyword));

  return (
    <div className="mt-6 h-full w-87.5 overflow-hidden rounded-t-2xl bg-white py-4">
      {data?.roomMatches?.rooms?.map((room) => (
        <ChatRoomListItem key={room.roomId} room={room} />
      ))}
      {data?.messageMatches?.messages?.map((message, index) => (
        <MessageListItem key={`${message.roomId}-${index}`} message={message} keyword={keyword} />
      ))}
    </div>
  );
}

export default function ChatSearch() {
  const [keyword, setKeyword] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const updateDebouncedQuery = useDebouncedCallback((value: string) => {
    const trimmed = value.trim();
    setDebouncedQuery(trimmed);
  }, 300);

  const handleChange = (value: string) => {
    setKeyword(value);
    updateDebouncedQuery(value);
  };

  return (
    <div className="flex h-full flex-col items-center pt-6">
      <label className="flex h-13 w-87.5 items-center overflow-hidden rounded-full bg-white px-3">
        <input
          type="text"
          value={keyword}
          onChange={(e) => handleChange(e.target.value)}
          className="h-full flex-1 bg-white px-3"
          placeholder="채팅방명, 채팅으로 검색"
        />
        <Search />
      </label>
      {debouncedQuery && <ChatSearchResults keyword={debouncedQuery} />}
    </div>
  );
}
