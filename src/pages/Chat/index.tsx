import { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Advertisement } from '@/apis/advertisement/entity';
import type { Room } from '@/apis/chat/entity';
import BellOffIcon from '@/assets/svg/bell-off.svg';
import ChevronLeftIcon from '@/assets/svg/chevron-left.svg';
import PersonIcon from '@/assets/svg/person.svg';
import BottomModal from '@/components/common/BottomModal';
import Modal from '@/components/common/Modal';
import BottomOverlaySpacer from '@/components/layout/BottomOverlaySpacer';
import { useAdvertisements } from '@/utils/hooks/useAdvertisements';
import { useLongPress } from '@/utils/hooks/useLongPress';
import ChatRoomContextMenu from './components/ChatRoomContextMenu';
import useChat from './hooks/useChat';

const DEFAULT_LAST_MESSAGE = '동아리에 궁금한 점을 물어보세요';
const FIRST_ADVERTISEMENT_ROOM_POSITION = 4;
const ADVERTISEMENT_INTERVAL = 6;

const getAdvertisementCount = (roomCount: number) => {
  if (roomCount < FIRST_ADVERTISEMENT_ROOM_POSITION) {
    return 0;
  }

  return Math.floor((roomCount - FIRST_ADVERTISEMENT_ROOM_POSITION) / ADVERTISEMENT_INTERVAL) + 1;
};

const getAdvertisementIndexAfterRoom = (roomIndex: number) => {
  const roomPosition = roomIndex + 1;

  if (roomPosition < FIRST_ADVERTISEMENT_ROOM_POSITION) {
    return null;
  }

  const roomOffsetFromFirstAdvertisement = roomPosition - FIRST_ADVERTISEMENT_ROOM_POSITION;

  if (roomOffsetFromFirstAdvertisement % ADVERTISEMENT_INTERVAL !== 0) {
    return null;
  }

  return Math.floor(roomOffsetFromFirstAdvertisement / ADVERTISEMENT_INTERVAL);
};

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
  onLongPress: (x: number, y: number, room: Room) => void;
}

function ChatRoomListItem({ room, onLongPress }: ChatRoomListItemProps) {
  const isGroup = room.chatType === 'GROUP';
  const hasUnreadMessage = room.unreadCount > 0;
  const previewMessage = room.lastMessage?.trim() || DEFAULT_LAST_MESSAGE;
  const longPress = useLongPress({
    onLongPress: (x: number, y: number) => onLongPress(x, y, room),
  });

  return (
    <Link
      {...longPress}
      to={`${room.roomId}`}
      className="active:bg-indigo-5 user-select-none flex touch-pan-y items-center gap-3 bg-white px-5 py-3 transition-colors"
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
  const { chatRoomList, updateRoomName } = useChat();
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    room: Room;
  } | null>(null);
  const [leaveRoom, setLeaveRoom] = useState<Room | null>(null);
  const [changeRoomName, setChangeRoomName] = useState<Room | null>(null);
  const [newRoomName, setNewRoomName] = useState('');
  const rooms = chatRoomList.rooms;
  const advertisementCount = getAdvertisementCount(rooms.length);
  const { advertisements, isLoadingAdvertisements, trackAdvertisementClick } = useAdvertisements({
    advertisementCount,
    scope: 'chat-list',
  });
  if (rooms.length === 0) {
    return (
      <div className="bg-indigo-0 flex min-h-full flex-col items-center justify-center px-6 py-3 text-center">
        <div className="text-sub2 text-text-700">채팅방이 없어요</div>
        <div className="text-body3 text-text-500 mt-1">동아리에 문의하면 채팅이 시작돼요</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-full min-w-full flex-col overflow-y-auto bg-gray-100 px-5 py-[23px]">
      <div className="h-full [&>*:first-child]:rounded-t-2xl [&>*:last-child]:rounded-b-lg">
        {rooms.map((room, index) => {
          const advertisementIndex = getAdvertisementIndexAfterRoom(index);
          const shouldRenderAdvertisement = advertisementIndex !== null;
          const advertisement = advertisementIndex !== null ? advertisements[advertisementIndex] : undefined;

          return (
            <Fragment key={room.roomId}>
              <ChatRoomListItem room={room} onLongPress={(x, y, room) => setContextMenu({ x, y, room })} />
              {advertisement && (
                <ChatAdvertisementListItem advertisement={advertisement} onClick={trackAdvertisementClick} />
              )}
              {!advertisement && shouldRenderAdvertisement && isLoadingAdvertisements && (
                <ChatAdvertisementListItemSkeleton />
              )}
            </Fragment>
          );
        })}
        <BottomOverlaySpacer gap={24} />
      </div>
      <Modal isOpen={leaveRoom !== null} onClose={() => setLeaveRoom(null)} className="h-[172px] w-[341px] rounded-2xl">
        <div className="px-6 py-6 text-center">
          <p className="text-text-700 mb-5 text-[16px] font-bold">채팅방 나가기</p>
          <p className="text-text-500 mt-2 text-[14px]">{leaveRoom?.roomName} 채팅방을 나가시겠어요?</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="ml-4 h-11 w-37 flex-1 cursor-pointer rounded-[10px] border border-[#69BFDF] py-4 text-[14px] font-bold text-[#69BFDF]"
            onClick={() => setLeaveRoom(null)}
          >
            취소
          </button>
          <button
            type="button"
            className="bg-primary-500 mr-4 flex-1 cursor-pointer rounded-[10px] py-4 text-[14px] font-medium text-white"
            onClick={() => setLeaveRoom(null)}
          >
            나가기
          </button>
        </div>
      </Modal>
      <BottomModal isOpen={changeRoomName !== null} onClose={() => setChangeRoomName(null)} className="h-59">
        <div className="flex items-center px-4 py-4">
          <button type="button" aria-label="닫기" onClick={() => setChangeRoomName(null)}>
            <ChevronLeftIcon className="size-6" />
          </button>
          <div className="px-30 text-center font-semibold">이름 변경</div>
        </div>
        <div className="flex w-full flex-col items-center gap-6">
          <input
            type="text"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            className="text-text-700 mt-11 h-[50px] w-[343px] rounded-2xl border border-indigo-50 text-center"
            placeholder="변경할 채팅방명을 입력해주세요."
          />
          <button
            type="button"
            className="bg-primary-500 w-[343px] flex-1 cursor-pointer rounded-[10px] py-4 text-[14px] font-medium text-white"
            onClick={() => {
              if (!changeRoomName) return;
              const roomId = changeRoomName.roomId;
              setChangeRoomName(null);
              void updateRoomName({ chatRoomId: roomId, name: newRoomName });
            }}
          >
            확인
          </button>
        </div>
      </BottomModal>
      {contextMenu && (
        <ChatRoomContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          title={contextMenu.room.roomName}
          items={[
            {
              label: '채팅방 이름 변경',
              onClick: () => {
                setChangeRoomName(contextMenu.room);
                setNewRoomName(contextMenu.room.roomName);
              },
            },
            { label: '알림 끄기', onClick: () => {} },
            {
              label: '채팅방 나가기',
              onClick: () => setLeaveRoom(contextMenu.room),
              danger: true,
            },
          ]}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}

export default ChatListPage;
