import type { Ref } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import ChevronLeftIcon from '@/assets/svg/chevron-left.svg';
import HamburgerIcon from '@/assets/svg/hamburger.svg';
import ToggleSwitch from '@/components/common/ToggleSwitch';
import useChat from '@/pages/Chat/hooks/useChat';
import { isGroupChatType } from '@/pages/Chat/utils/chatType';
import { useApiErrorToast } from '@/utils/hooks/error/useApiErrorToast';
import { useSmartBack } from '@/utils/hooks/useSmartBack';
import { cn } from '@/utils/ts/cn';

function ChatHeader({ headerRef }: { headerRef?: Ref<HTMLElement> }) {
  const smartBack = useSmartBack();
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname, state } = location;
  const { chatRoomId } = useParams();
  const numericRoomId = Number(chatRoomId);
  const isInfoPage = pathname.endsWith('/info');

  const showApiErrorToast = useApiErrorToast();
  const { chatRoomList, clubMembers, toggleMute, isTogglingMute } = useChat(numericRoomId);

  const chatRoom = chatRoomList.rooms.find((room) => room.roomId === numericRoomId);
  const isGroup = isGroupChatType(chatRoom?.chatType);
  const isMuted = chatRoom?.isMuted ?? false;

  const handleBack = () => {
    if (isInfoPage && chatRoomId) {
      navigate(`/chats/${chatRoomId}`, { state });
      return;
    }

    smartBack();
  };

  const handleToggleMute = async () => {
    try {
      await toggleMute(numericRoomId);
    } catch (error) {
      showApiErrorToast(error, '알림 설정 변경에 실패했습니다.');
    }
  };

  return (
    <header
      ref={headerRef}
      className={cn('fixed top-0 right-0 left-0 z-30 flex items-center bg-white', {
        'h-13 px-4 py-2': !isInfoPage,
        'h-15.75 rounded-b-3xl px-4 py-3 shadow-[0_0_20px_0_rgba(0,0,0,0.03)]': isInfoPage,
      })}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button type="button" aria-label="뒤로가기" onClick={handleBack} className="shrink-0">
          <ChevronLeftIcon />
        </button>

        <div className="flex min-w-0 items-center gap-1">
          <span className="truncate leading-5 font-bold text-indigo-700">{chatRoom?.roomName ?? ''}</span>
          {isGroup && <span className="text-text-700 text-[13px] leading-5">{clubMembers.length}</span>}
        </div>
      </div>

      {isInfoPage ? (
        <ToggleSwitch
          label={isMuted ? '알림 켜기' : '알림 끄기'}
          enabled={!isMuted}
          onChange={() => void handleToggleMute()}
          disabled={isTogglingMute}
          ariaLabel="채팅방 알림 설정"
          layout="horizontal"
          variant="manager"
          className="shrink-0"
        />
      ) : (
        <Link to={`/chats/${chatRoomId}/info`} state={state} className="shrink-0" aria-label="채팅방 정보 열기">
          <HamburgerIcon />
        </Link>
      )}
    </header>
  );
}

export default ChatHeader;
