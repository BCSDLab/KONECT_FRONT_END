import { type ComponentType, type Ref, type SVGProps } from 'react';
import { Link, useLocation } from 'react-router-dom';
import HomeResultImage from '@/assets/image/bottom-nav-home.png';
import ClubsIcon from '@/assets/svg/bottom-nav-clubs.svg';
import MyPageIcon from '@/assets/svg/bottom-nav-mypage.svg';
import ChatIcon from '@/assets/svg/bottom-nav-sms.svg';
import TimerIcon from '@/assets/svg/bottom-nav-timer.svg';
import useUnreadChatCount from '@/pages/Chat/hooks/useUnreadChatCount';
import { cn } from '@/utils/ts/cn';

interface BottomNavItemConfig {
  to: string;
  label: string;
  Icon?: ComponentType<SVGProps<SVGSVGElement>>;
  floatingImageSrc?: string;
  matchesPath?: (pathname: string) => boolean;
}

const BOTTOM_NAV_ITEMS = [
  { to: '/clubs', label: '동아리', Icon: ClubsIcon },
  { to: '/timer', label: '타이머', Icon: TimerIcon },
  {
    to: '/home',
    label: '홈',
    floatingImageSrc: HomeResultImage,
    matchesPath: (pathname) => pathname === '/home' || pathname === '/notifications' || pathname.startsWith('/council'),
  },
  { to: '/chats', label: '채팅방', Icon: ChatIcon },
  { to: '/mypage', label: '내정보', Icon: MyPageIcon },
] satisfies BottomNavItemConfig[];

function matchesBottomNavItemPath({ to, matchesPath }: BottomNavItemConfig, pathname: string) {
  if (matchesPath) {
    return matchesPath(pathname);
  }

  return pathname === to || pathname.startsWith(`${to}/`);
}

function formatUnreadChatCount(unreadCount: number) {
  if (unreadCount <= 0) {
    return null;
  }

  return unreadCount > 99 ? '99+' : String(unreadCount);
}

interface BottomNavItemProps {
  item: BottomNavItemConfig;
  isSelected: boolean;
  unreadCount?: number;
}

function BottomNavItem({ item, isSelected, unreadCount = 0 }: BottomNavItemProps) {
  const { to, label, Icon, floatingImageSrc } = item;
  const unreadCountLabel = formatUnreadChatCount(unreadCount);
  const hasUnreadCount = unreadCountLabel !== null;

  return (
    <Link
      to={to}
      aria-current={isSelected ? 'page' : undefined}
      aria-label={hasUnreadCount ? `${label}, 읽지 않은 메시지 ${unreadCount}개` : undefined}
      className="relative h-[46px] w-10 shrink-0 overflow-visible"
    >
      {floatingImageSrc ? (
        <img
          src={floatingImageSrc}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute top-[-26px] left-[-11px] z-10 h-[54px] w-[65px] max-w-none filter-[drop-shadow(0_3px_10px_rgba(0,0,0,0.10))]"
        />
      ) : Icon ? (
        <div className="absolute top-0 left-1/2 size-7 -translate-x-1/2">
          <Icon className={cn('size-7', isSelected ? 'text-primary-500' : 'text-text-400')} />
          {hasUnreadCount && (
            <span
              aria-hidden="true"
              className={cn(
                'bg-primary-500 absolute -top-1 -right-2 inline-flex h-4 items-center justify-center rounded-[100px] text-center text-[10px] leading-[1.6] text-white',
                unreadCountLabel.length > 2 ? 'min-w-4 px-1' : 'size-4'
              )}
            >
              {unreadCountLabel}
            </span>
          )}
        </div>
      ) : null}
      <span
        className={cn(
          'absolute bottom-0 left-1/2 min-w-8 -translate-x-1/2 text-center text-[12px] leading-[1.6] font-semibold whitespace-nowrap',
          isSelected ? 'text-primary-500' : 'text-text-400'
        )}
      >
        {label}
      </span>
    </Link>
  );
}

interface BottomNavProps {
  navRef?: Ref<HTMLElement>;
}

function BottomNav({ navRef }: BottomNavProps) {
  const { pathname } = useLocation();
  const { totalUnreadCount } = useUnreadChatCount();

  return (
    <nav
      ref={navRef}
      className="fixed right-0 bottom-0 left-0 z-20 rounded-t-[20px] border-t border-[#e0e0e0] bg-white"
    >
      <div className="flex min-h-20 w-full items-center justify-around px-4">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const isSelected = matchesBottomNavItemPath(item, pathname);
          const unreadCount = item.to === '/chats' ? totalUnreadCount : 0;

          return <BottomNavItem key={item.to} item={item} isSelected={isSelected} unreadCount={unreadCount} />;
        })}
      </div>
    </nav>
  );
}

export default BottomNav;
