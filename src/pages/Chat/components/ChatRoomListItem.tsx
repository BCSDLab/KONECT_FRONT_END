import { Fragment, type ComponentProps, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { Messages, Room } from '@/apis/chat/entity';
import BellOffIcon from '@/assets/svg/bell-off.svg';
import PersonIcon from '@/assets/svg/person.svg';
import { formatTime } from '@/pages/Chat/utils/formatTime';
import { useLongPress } from '@/utils/hooks/useLongPress';

export function ChatRoomAvatar({ roomImageUrl }: Pick<Room, 'roomImageUrl'>) {
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

interface ChatRoomListItemProps {
  room: Room;
  defaultMessage?: string;
  onLongPress?: (x: number, y: number, room: Room) => void;
  navigationState?: ComponentProps<typeof Link>['state'];
}

interface ChatMessageListItemProps {
  message: Messages;
  keyword: string;
  navigationState?: ComponentProps<typeof Link>['state'];
}

interface ChatListItemBaseProps {
  to: string;
  roomImageUrl: string;
  roomName: string;
  sentAt?: string | null;
  preview: ReactNode;
  titleExtra?: ReactNode;
  previewExtra?: ReactNode;
  navigationState?: ComponentProps<typeof Link>['state'];
  linkProps?: Omit<ComponentProps<typeof Link>, 'children' | 'className' | 'to'>;
}

function ChatListItemBase({
  to,
  roomImageUrl,
  roomName,
  sentAt,
  preview,
  titleExtra,
  previewExtra,
  navigationState,
  linkProps,
}: ChatListItemBaseProps) {
  return (
    <Link
      {...linkProps}
      to={to}
      state={navigationState}
      className="active:bg-indigo-5 flex touch-pan-y items-center gap-3 bg-white px-4 py-3 transition-colors select-none"
    >
      <ChatRoomAvatar roomImageUrl={roomImageUrl} />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-1">
            <span className="text-text-700 truncate leading-[1.6] font-semibold">{roomName}</span>
            {titleExtra}
          </div>
          {sentAt && <span className="text-text-500 shrink-0 text-xs leading-[1.6]">{formatTime(sentAt)}</span>}
        </div>
        <div className="mt-0.5 flex items-center gap-3">
          <p className="text-text-500 min-w-0 flex-1 truncate text-xs leading-[1.6]">{preview}</p>
          {previewExtra}
        </div>
      </div>
    </Link>
  );
}

export function ChatRoomListItem({ room, defaultMessage = '', onLongPress, navigationState }: ChatRoomListItemProps) {
  const hasUnreadMessage = room.unreadCount > 0;
  const previewMessage = room.lastMessage?.trim() || defaultMessage;
  const longPress = useLongPress({
    onLongPress: (x, y) => onLongPress?.(x, y, room),
  });

  return (
    <ChatListItemBase
      linkProps={longPress}
      to={`/chats/${room.roomId}`}
      roomImageUrl={room.roomImageUrl}
      roomName={room.roomName}
      sentAt={room.lastSentAt}
      preview={previewMessage}
      navigationState={navigationState}
      titleExtra={room.isMuted && <BellOffIcon aria-hidden className="size-3.5 shrink-0 opacity-50" />}
      previewExtra={
        hasUnreadMessage && (
          <span className="shrink-0">
            <span
              aria-hidden="true"
              className="bg-primary-500 flex h-4 min-w-5 items-center justify-center rounded-full px-1 py-0.5 text-[10px] text-white"
            >
              {room.unreadCount > 300 ? '300+' : room.unreadCount}
            </span>
          </span>
        )
      }
    />
  );
}

export function ChatMessageListItem({ message, keyword, navigationState }: ChatMessageListItemProps) {
  const parts = message.matchedMessage.split(keyword);

  return (
    <ChatListItemBase
      to={`/chats/${message.roomId}?messageId=${message.matchedMessageId}`}
      roomImageUrl={message.roomImageUrl}
      roomName={message.roomName}
      sentAt={message.matchedMessageSentAt}
      navigationState={navigationState}
      preview={parts.map((part, index) => (
        <Fragment key={index}>
          {part}
          {index < parts.length - 1 && <span className="font-bold">{keyword}</span>}
        </Fragment>
      ))}
    />
  );
}
