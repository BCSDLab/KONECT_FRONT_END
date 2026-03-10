import { Link } from 'react-router-dom';
import ChatCatIcon from '@/assets/svg/chat-cat.svg';
import useChat from '@/pages/Chat/hooks/useChat';

function NotificationBell() {
  const { totalUnreadCount } = useChat();

  return (
    <Link to={'chats'} className="relative">
      <ChatCatIcon />
      {totalUnreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] text-white">
          {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
        </span>
      )}
    </Link>
  );
}

export default NotificationBell;
