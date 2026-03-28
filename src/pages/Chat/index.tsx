import { Fragment, useRef, type Ref } from 'react';
import { Link } from 'react-router-dom';
import type { Advertisement } from '@/apis/advertisement/entity';
import type { Room } from '@/apis/chat/entity';
import BellOffIcon from '@/assets/svg/bell-off.svg';
import PersonIcon from '@/assets/svg/person.svg';
import { getBottomOverlayOffset } from '@/components/layout/layoutMetrics';
import { useLayoutElementsContext } from '@/contexts/useLayoutElementsContext';
import { useAdvertisementInterval } from '@/utils/hooks/useAdvertisementInterval';
import { useAdvertisements } from '@/utils/hooks/useAdvertisements';
import useChat from './hooks/useChat';

const DEFAULT_LAST_MESSAGE = '동아리에 궁금한 점을 물어보세요';
const CHAT_LIST_BOTTOM_GAP = 24;

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

interface ChatRoomListItemProps {
  room: Room;
  itemRef?: Ref<HTMLAnchorElement>;
}

function ChatRoomListItem({ room, itemRef }: ChatRoomListItemProps) {
  const isGroup = room.chatType === 'GROUP';
  const hasUnreadMessage = room.unreadCount > 0;
  const previewMessage = room.lastMessage?.trim() || DEFAULT_LAST_MESSAGE;

  return (
    <Link
      ref={itemRef}
      to={`${room.roomId}`}
      className="active:bg-indigo-5 flex items-center gap-3 bg-white px-5 py-3 transition-colors"
    >
      <ChatRoomAvatar roomImageUrl={room.roomImageUrl} />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-1">
            <span className="text-text-700 truncate text-[16px] leading-[1.6] font-semibold">{room.roomName}</span>

            {isGroup && (
              <span className="bg-primary-500 inline-flex shrink-0 items-center justify-center rounded-[50px] px-1 py-0.5 text-[12px] leading-3 font-medium text-white">
                단체
              </span>
            )}

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
              <span aria-hidden="true" className="bg-primary-500 block size-2 rounded-full" />
              <span className="sr-only">{`읽지 않은 메시지 ${room.unreadCount}개`}</span>
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

interface ChatAdvertisementListItemProps {
  advertisement: Advertisement;
  onClick: (advertisementId: number) => void;
}

function ChatAdvertisementListItem({ advertisement, onClick }: ChatAdvertisementListItemProps) {
  return (
    <a
      href={advertisement.linkUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => onClick(advertisement.id)}
      className="active:bg-indigo-5 flex items-center gap-3 bg-white px-5 py-3 transition-colors"
    >
      <img
        src={advertisement.imageUrl}
        alt={advertisement.title}
        className="h-12 w-12 shrink-0 rounded-sm object-cover"
      />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-1">
            <span className="text-text-700 truncate text-[16px] leading-[1.6] font-semibold">
              {advertisement.title}
            </span>
            <span className="bg-primary-500 inline-flex shrink-0 items-center justify-center rounded-[50px] px-1 py-0.5 text-[12px] leading-3 font-medium text-white">
              광고
            </span>
          </div>
        </div>

        <div className="mt-0.5 flex items-center gap-3">
          <p className="text-text-500 min-w-0 flex-1 truncate text-[12px] leading-[1.6] font-normal">
            {advertisement.description}
          </p>
        </div>
      </div>
    </a>
  );
}

function ChatAdvertisementListItemSkeleton() {
  return (
    <div aria-hidden="true" className="flex items-center gap-3 bg-white px-5 py-3">
      <div className="bg-indigo-25 h-12 w-12 shrink-0 animate-pulse rounded-sm" />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-1">
            <div className="bg-indigo-25 h-6 w-32 max-w-full animate-pulse rounded" />
            <div className="bg-indigo-25 h-5 w-10 shrink-0 animate-pulse rounded-full" />
          </div>
        </div>

        <div className="mt-0.5 flex items-center gap-3">
          <div className="bg-indigo-25 h-5 w-40 max-w-full animate-pulse rounded" />
        </div>
      </div>
    </div>
  );
}

function ChatListPage() {
  const { bottomOverlayInset } = useLayoutElementsContext();
  const { chatRoomList } = useChat();
  const rooms = chatRoomList.rooms;
  const firstChatRoomItemRef = useRef<HTMLAnchorElement>(null);
  const secondChatRoomItemRef = useRef<HTMLAnchorElement>(null);
  const chatRoomSlotsPerAdvertisement = useAdvertisementInterval({
    firstItemRef: firstChatRoomItemRef,
    secondItemRef: secondChatRoomItemRef,
    itemCount: rooms.length,
    enabled: rooms.length > 0,
  });
  const advertisementCount = chatRoomSlotsPerAdvertisement
    ? Math.floor(rooms.length / chatRoomSlotsPerAdvertisement)
    : 0;
  const { advertisements, isLoadingAdvertisements, trackAdvertisementClick } = useAdvertisements({
    advertisementCount,
    scope: 'chat-list',
  });
  const bottomSpacerHeight = getBottomOverlayOffset(bottomOverlayInset, CHAT_LIST_BOTTOM_GAP);

  if (rooms.length === 0) {
    return (
      <div className="bg-indigo-0 flex min-h-full flex-col items-center justify-center px-6 py-3 text-center">
        <div className="text-sub2 text-text-700">채팅방이 없어요</div>
        <div className="text-body3 text-text-500 mt-1">동아리에 문의하면 채팅이 시작돼요</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col bg-white py-3">
      {rooms.map((room, index) => {
        const shouldRenderAdvertisement =
          chatRoomSlotsPerAdvertisement !== null && (index + 1) % chatRoomSlotsPerAdvertisement === 0;
        const advertisement = shouldRenderAdvertisement
          ? advertisements[Math.floor(index / chatRoomSlotsPerAdvertisement)]
          : undefined;

        return (
          <Fragment key={room.roomId}>
            <ChatRoomListItem
              room={room}
              itemRef={index === 0 ? firstChatRoomItemRef : index === 1 ? secondChatRoomItemRef : undefined}
            />
            {advertisement && (
              <ChatAdvertisementListItem advertisement={advertisement} onClick={trackAdvertisementClick} />
            )}
            {!advertisement && shouldRenderAdvertisement && isLoadingAdvertisements && (
              <ChatAdvertisementListItemSkeleton />
            )}
          </Fragment>
        );
      })}
      <div aria-hidden="true" className="shrink-0" style={{ height: bottomSpacerHeight }} />
    </div>
  );
}

export default ChatListPage;
