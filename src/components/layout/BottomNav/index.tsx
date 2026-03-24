import { type ComponentType, type Ref, type SVGProps } from 'react';
import { NavLink } from 'react-router-dom';
import HomeResultImage from '@/assets/image/bottom-nav-home.png';
import ChatIcon from '@/assets/svg/bottom-nav-chat.svg';
import ClubsIcon from '@/assets/svg/bottom-nav-clubs.svg';
import MyPageIcon from '@/assets/svg/bottom-nav-mypage.svg';
import TimerIcon from '@/assets/svg/bottom-nav-timer.svg';
import { cn } from '@/utils/ts/cn';

interface BottomNavItemConfig {
  to: string;
  label: string;
  Icon?: ComponentType<SVGProps<SVGSVGElement>>;
  floatingImageSrc?: string;
  end?: boolean;
}

const BOTTOM_NAV_ITEMS = [
  { to: '/clubs', label: '동아리', Icon: ClubsIcon },
  { to: '/timer', label: '타이머', Icon: TimerIcon },
  {
    to: '/home',
    label: '홈',
    floatingImageSrc: HomeResultImage,
    end: true,
  },
  { to: '/chats', label: '채팅방', Icon: ChatIcon, end: true },
  { to: '/mypage', label: '내정보', Icon: MyPageIcon },
] satisfies BottomNavItemConfig[];

function BottomNavItem({ to, label, Icon, floatingImageSrc, end = false }: BottomNavItemConfig) {
  return (
    <NavLink to={to} end={end} className="relative h-[46px] w-10 shrink-0 overflow-visible">
      {({ isActive }) => {
        const shouldShowFloatingImage = Boolean(floatingImageSrc);

        return (
          <>
            {shouldShowFloatingImage ? (
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
                  isActive ? 'text-primary-500' : 'text-text-400'
                )}
              />
            ) : null}
            <span
              className={cn(
                'absolute bottom-0 left-1/2 min-w-8 -translate-x-1/2 text-center text-[12px] leading-[1.6] font-semibold whitespace-nowrap',
                isActive ? 'text-primary-500' : 'text-text-400'
              )}
            >
              {label}
            </span>
          </>
        );
      }}
    </NavLink>
  );
}

interface BottomNavProps {
  navRef?: Ref<HTMLElement>;
}

function BottomNav({ navRef }: BottomNavProps) {
  return (
    <nav
      ref={navRef}
      className="fixed right-0 bottom-0 left-0 z-20 rounded-t-[20px] border-t border-[#e0e0e0] bg-white"
    >
      <div className="flex min-h-20 w-full items-center justify-around px-[31px]">
        {BOTTOM_NAV_ITEMS.map((item) => (
          <BottomNavItem key={item.to} {...item} />
        ))}
      </div>
    </nav>
  );
}

export default BottomNav;
