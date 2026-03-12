import { useState } from 'react';
import { Link } from 'react-router-dom';
import ChatCatIcon from '@/assets/svg/chat-cat.svg';
import MegaphoneSmIcon from '@/assets/svg/megaphone-sm.svg';
import useChat from '@/pages/Chat/hooks/useChat';
import { cn } from '@/utils/ts/cn';

const CHAT_TOOLTIP_DISMISSED_STORAGE_KEY = 'chat-tooltip-dismissed:v1';

const readChatTooltipDismissed = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    return window.localStorage.getItem(CHAT_TOOLTIP_DISMISSED_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
};

interface NotificationBellProps {
  showTooltip?: boolean;
}

function NotificationBell({ showTooltip = false }: NotificationBellProps) {
  const { totalUnreadCount } = useChat();
  const [isTooltipDismissed, setIsTooltipDismissed] = useState(readChatTooltipDismissed);

  const shouldShowTooltip = showTooltip && !isTooltipDismissed;

  const handleChatButtonClick = () => {
    if (isTooltipDismissed) {
      return;
    }

    setIsTooltipDismissed(true);

    try {
      window.localStorage.setItem(CHAT_TOOLTIP_DISMISSED_STORAGE_KEY, 'true');
    } catch {
      // Ignore storage failures and continue navigation.
    }
  };

  return (
    <div className="relative inline-flex">
      <Link
        to={'chats'}
        aria-label="채팅 열기"
        onClick={handleChatButtonClick}
        className={cn('relative inline-flex', shouldShowTooltip && 'chat-tooltip-anchor')}
      >
        <ChatCatIcon className="drop-shadow-[0_4px_4px_rgba(0,0,0,0.20)]" />
        {totalUnreadCount > 0 ? (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] text-white">
            {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
          </span>
        ) : null}
      </Link>

      {shouldShowTooltip ? (
        <div className="chat-tooltip pointer-events-none absolute top-[calc(100%+2px)] right-0 z-10 w-[149px]">
          <span
            className="chat-tooltip-arrow absolute -top-1.5 right-[15px] h-3 w-3.5 bg-black/40 [clip-path:polygon(50%_0,0_100%,100%_100%)]"
            aria-hidden
          />
          <div className="mt-1.5 flex items-center gap-1 rounded-[20px] bg-black/40 px-2.5 py-1 text-white">
            <MegaphoneSmIcon className="text-warning-600 size-[13px] shrink-0" />
            <span className="text-cap2-strong whitespace-nowrap">채팅방 기능을 사용해보세요!</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default NotificationBell;
