import { Link } from 'react-router-dom';
import BellOfIcon from '@/assets/svg/bell-off.svg';
import useChat from './hooks/useChat';

function ChatListPage() {
  const { chatRoomList } = useChat();

  const formatTime = (timeString: string) => {
    const timePart = timeString.split(' ')[1];
    const [hour, minute] = timePart.split(':').map(Number);
    const period = hour < 12 ? '오전' : '오후';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${period} ${displayHour}:${String(minute).padStart(2, '0')}`;
  };

  if (chatRoomList.rooms.length === 0) {
    return (
      <div className="bg-indigo-0 flex min-h-0 flex-1 flex-col items-center justify-center py-3">
        <div className="text-sm text-gray-500">채팅방이 없어요</div>
        <div className="mt-1 text-xs text-gray-400">동아리에 문의하면 채팅이 시작돼요</div>
      </div>
    );
  }

  return (
    <div className="bg-indigo-0 flex min-h-0 flex-1 flex-col py-3">
      {chatRoomList.rooms.map((room) => {
        const isGroup = room.chatType === 'GROUP';

        return (
          <Link
            to={`${room.roomId}`}
            key={room.roomId}
            className="active:bg-indigo-5 bg-indigo-0 flex items-center gap-3 px-5 py-4"
          >
            <img
              src={room.roomImageUrl}
              alt={room.roomName}
              className={`h-11 w-11 shrink-0 rounded-full border ${isGroup ? 'border-primary' : 'border-indigo-5'}`}
            />

            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="text-sm leading-4 font-bold text-indigo-700">{room.roomName}</div>

                  {isGroup && <span className="bg-primary text-cap2 rounded px-1.5 py-0.5 text-white">단체</span>}
                  {room.isMuted && (
                    <span className="text-xs text-gray-400">
                      <BellOfIcon className="h-4 w-4" />
                    </span>
                  )}
                </div>

                <div className="shrink-0 text-xs leading-3.5 font-medium text-indigo-300">
                  {room.lastSentAt ? formatTime(room.lastSentAt) : ''}
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="max-w-[80%] min-w-0 truncate text-xs leading-3.5 font-medium text-indigo-300">
                  {room.lastMessage ?? '동아리에 궁금한 점을 물어보세요'}
                </div>

                {room.unreadCount > 0 && (
                  <div className="text-indigo-0 min-w-5 shrink-0 rounded-full bg-[#3182f6] px-1 py-0.5 text-center">
                    {room.unreadCount}
                  </div>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default ChatListPage;
