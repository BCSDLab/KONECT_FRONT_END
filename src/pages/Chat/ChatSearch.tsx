import { useState, Fragment } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import type { Messages, Room } from '@/apis/chat/entity';
import { chatQueries } from '@/apis/chat/queries';
import BellOffIcon from '@/assets/svg/bell-off.svg';
import Search from '@/assets/svg/big-search-icon.svg';
import PersonIcon from '@/assets/svg/person.svg';
import ChatSearchHeader from '@/components/layout/Header/components/ChatSearchHeader';
import useDebouncedCallback from '@/utils/hooks/useDebounce';

const DEFAULT_LAST_MESSAGE = '원하는 채팅을 찾아보세요';

const formatTime = (timeString: string) => {
  const timeMatch = timeString.match(/(\d{1,2}):(\d{2})/);

  if (!timeMatch) {
    return '';
  }

  const hour = Number(timeMatch[1]);
  const minute = Number(timeMatch[2]);
  const period = hour < 12 ? '오전' : '오후';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;

  return `${period} ${displayHour}:${String(minute).padStart(2, '0')}`;
};

function ChatRoomAvatar({ roomImageUrl }: Pick<Room, 'roomImageUrl'>) {
  if (roomImageUrl) {
    return (
      <img
        src={roomImageUrl}
        alt=""
        aria-hidden="true"
        className="border-indigo-5 size-12 shrink-0 rounded-full border object-cover"
      />
    );
  }

  return (
    <div className="bg-indigo-5 flex size-12 shrink-0 items-center justify-center rounded-full" aria-hidden="true">
      <PersonIcon className="size-6 text-white" />
    </div>
  );
}

function RoomListItem({ room }: { room: Room }) {
  const hasUnreadMessage = room.unreadCount > 0;
  const previewMessage = room.lastMessage?.trim() || DEFAULT_LAST_MESSAGE;

  return (
    <Link
      to={`/chats/${room.roomId}`}
      className="active:bg-indigo-5 flex touch-pan-y items-center gap-3 bg-white px-4 py-3 transition-colors select-none"
    >
      <ChatRoomAvatar roomImageUrl={room.roomImageUrl} />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-1">
            <span className="text-text-700 truncate text-[16px] leading-[1.6] font-semibold">{room.roomName}</span>
            {room.isMuted && <BellOffIcon aria-hidden className="size-3.5 shrink-0 opacity-50" />}
          </div>
          {room.lastSentAt && (
            <span className="text-text-500 shrink-0 text-[12px] leading-[1.6] font-normal">
              {formatTime(room.lastSentAt)}
            </span>
          )}
        </div>
        <div className="mt-0.5 flex items-center gap-3">
          <p className="text-text-500 min-w-0 flex-1 truncate text-[12px] leading-[1.6] font-normal">
            {previewMessage}
          </p>
          {hasUnreadMessage && (
            <span className="shrink-0">
              <span
                aria-hidden="true"
                className="bg-primary-500 flex h-4 min-w-5 items-center justify-center rounded-full px-1 py-0.5 text-[10px] text-white"
              >
                {room.unreadCount > 300 ? '300+' : room.unreadCount}
              </span>
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

function MessageListItem({ message, keyword }: { message: Messages; keyword: string }) {
  const parts = message.matchedMessage.split(keyword);
  return (
    <Link
      to={`/chats/${message.roomId}`}
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

  const { data } = useQuery({
    ...chatQueries.search(debouncedQuery),
    enabled: !!debouncedQuery,
  });

  const title = '채팅방 검색';
  return (
    <div className="flex h-full flex-col items-center pt-6">
      <ChatSearchHeader title={title} />
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
      {debouncedQuery && (
        <div className="mt-6 h-full w-87.5 overflow-hidden rounded-t-2xl bg-white py-4">
          {data?.roomMatches?.rooms?.map((room) => (
            <RoomListItem key={room.roomId} room={room} />
          ))}
          {data?.messageMatches?.messages?.map((message, index) => (
            <MessageListItem key={`${message.roomId}-${index}`} message={message} keyword={debouncedQuery} />
          ))}
        </div>
      )}
    </div>
  );
}
