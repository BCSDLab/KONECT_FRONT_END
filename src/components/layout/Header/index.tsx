import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import ChatCircleIcon from '@/assets/svg/chat-circle.svg';
import ChevronLeftIcon from '@/assets/svg/chevron-left.svg';
import useChat from '@/pages/Chat/hooks/useChat';
import { useMyInfo } from '@/pages/User/Profile/hooks/useMyInfo';
import { ROUTE_TITLES } from './routeTitles';

const INFO_HEADER_LIST = ['/home', '/council'];

function NotificationBell() {
  const { totalUnreadCount } = useChat();

  return (
    <Link to={'chats'} className="relative">
      <ChatCircleIcon />
      {totalUnreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] text-white">
          {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
        </span>
      )}
    </Link>
  );
}

function InfoHeader() {
  const { myInfo } = useMyInfo();

  return (
    <header className="fixed top-0 right-0 left-0 flex items-center bg-white px-3 py-2">
      <div className="flex flex-1 flex-col gap-1">
        <div className="text-sm leading-4 font-semibold text-indigo-700">{myInfo.universityName}</div>
        <div className="text-[10px] leading-3 text-indigo-300">
          {myInfo.name} {myInfo.studentNumber}
        </div>
      </div>
      <NotificationBell />
    </header>
  );
}

function ProfileHeader() {
  return (
    <header className="fixed top-0 right-0 left-0 flex h-11 items-center justify-end bg-white px-4 py-2 shadow-[0_1px_1px_0_rgba(0,0,0,0.04)]">
      <NotificationBell />
    </header>
  );
}

function ChatHeader() {
  const navigate = useNavigate();
  const { chatRoomId } = useParams();
  const { chatRoomList } = useChat();

  const chatRoom = chatRoomList.chatRooms.find((room) => room.chatRoomId === Number(chatRoomId));

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
      <span className="text-lg">{chatRoom?.chatPartnerName ?? ''}</span>
    </header>
  );
}

function DefaultHeader({ title }: { title: string }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleBack = () => {
    if (pathname === '/signup') {
      navigate('/');
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="fixed top-0 right-0 left-0 flex h-11 items-center justify-center bg-white px-4 py-2">
      <button
        type="button"
        aria-label="뒤로가기"
        onClick={handleBack}
        className="absolute top-1/2 left-4 -translate-y-1/2"
      >
        <ChevronLeftIcon />
      </button>
      <span className="text-lg">{title}</span>
    </header>
  );
}

function NormalHeader({ title }: { title: string }) {
  return (
    <header className="fixed top-0 right-0 left-0 flex h-11 items-center justify-center bg-white px-4 py-2">
      <span className="text-lg">{title}</span>
    </header>
  );
}

function Header() {
  const { pathname } = useLocation();
  const title = ROUTE_TITLES.find((route) => route.match(pathname))?.title ?? '';

  if (pathname === '/me') {
    return <ProfileHeader />;
  }

  if (INFO_HEADER_LIST.includes(pathname)) {
    return <InfoHeader />;
  }

  if (/^\/chats\/\d+$/.test(pathname)) {
    return <ChatHeader />;
  }

  if (pathname === '/') {
    return <NormalHeader title={title} />;
  }

  return <DefaultHeader title={title} />;
}

export default Header;
