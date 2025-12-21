import { Link } from 'react-router-dom';
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

  return (
    <div className="bg-indigo-0 flex min-h-0 flex-1 flex-col py-3">
      {chatRoomList.chatRooms.map((chatRoom) => (
        <Link
          to={`${chatRoom.chatRoomId}`}
          key={chatRoom.chatRoomId}
          className="active:bg-indigo-5 bg-indigo-0 flex items-center gap-3 px-5 py-4"
        >
          <img
            src={chatRoom.chatPartnerProfileImage}
            alt={chatRoom.chatPartnerName}
            className="border-indigo-5 h-11 w-11 shrink-0 rounded-full border"
          />
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="text-sm leading-4 font-bold text-indigo-700">{chatRoom.chatPartnerName}</div>
              <div className="shrink-0 text-xs leading-3.5 font-medium text-indigo-300">
                {chatRoom.lastSentTime ? formatTime(chatRoom.lastSentTime) : ''}
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="max-w-[80%] min-w-0 truncate text-xs leading-3.5 font-medium text-indigo-300">
                {chatRoom.lastMessage ? chatRoom.lastMessage : '동아리에 궁금한 점을 물어보세요'}
              </div>
              {chatRoom.unreadCount > 0 && (
                <div className="text-indigo-0 shrink-0 rounded-full bg-[#3182f6] px-1 py-0.5 text-center">
                  {chatRoom.unreadCount}
                </div>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default ChatListPage;
