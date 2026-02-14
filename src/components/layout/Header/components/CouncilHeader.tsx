import { useNavigate, useParams } from 'react-router-dom';
import ChevronLeftIcon from '@/assets/svg/chevron-left.svg';
import useChat from '@/pages/Chat/hooks/useChat';

function ChatHeader() {
  const navigate = useNavigate();
  const { chatRoomId } = useParams();
  const { chatRoomList } = useChat();

  const chatRoom = chatRoomList.rooms.find((room) => room.roomId === Number(chatRoomId));

  return (
    <header className="fixed top-0 right-0 left-0 flex h-11 items-center justify-center bg-white px-4 py-2">
      <button
        type="button"
        aria-label="뒤로가기"
        onClick={() => navigate(-1)}
        className="absolute top-1/2 left-4 -translate-y-1/2"
      >
        <ChevronLeftIcon />
      </button>
      <span className="text-lg">{chatRoom?.roomName ?? ''}</span>
    </header>
  );
}

export default ChatHeader;
