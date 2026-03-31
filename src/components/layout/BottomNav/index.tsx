import { type ComponentType, type Ref, type SVGProps } from 'react';
import { Link, useLocation } from 'react-router-dom';
import HomeResultImage from '@/assets/image/bottom-nav-home.png';
import ClubsIcon from '@/assets/svg/bottom-nav-clubs.svg';
import MyPageIcon from '@/assets/svg/bottom-nav-mypage.svg';
import ChatIcon from '@/assets/svg/bottom-nav-sms.svg';
import TimerIcon from '@/assets/svg/bottom-nav-timer.svg';
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
    matchesPath: (pathname) =>
      pathname === '/home' ||
      pathname === '/notifications' ||
      pathname === '/council' ||
      pathname.startsWith('/council/'),
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

interface BottomNavItemProps {
  item: BottomNavItemConfig;
  isSelected: boolean;
}

function BottomNavItem({ item, isSelected }: BottomNavItemProps) {
  const { to, label, Icon, floatingImageSrc } = item;

  return (
    <Link
      to={to}
      aria-current={isSelected ? 'page' : undefined}
      className="relative h-[46px] w-10 shrink-0 overflow-visible"
    >
      {floatingImageSrc ? (
        <img
          src={floatingImageSrc}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute top-[-26px] left-[-11px] z-10 h-[54px] w-[65px] max-w-none filter-[drop-shadow(0_4px_4px_rgba(0,0,0,0.15))]"
        />
      ) : Icon ? (
        <Icon
          className={cn(
            'absolute top-0 left-1/2 size-7 -translate-x-1/2',
            isSelected ? 'text-primary-500' : 'text-text-400'
          )}
        />
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

  return (
    <nav
      ref={navRef}
      className="fixed right-0 bottom-0 left-0 z-20 rounded-t-[20px] border-t border-[#e0e0e0] bg-white"
    >
      <div className="flex min-h-20 w-full items-center justify-around px-[31px]">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const isSelected = matchesBottomNavItemPath(item, pathname);

          return <BottomNavItem key={item.to} item={item} isSelected={isSelected} />;
        })}
      </div>
    </nav>
  );
}

export default BottomNav;
