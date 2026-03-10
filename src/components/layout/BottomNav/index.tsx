import { type ComponentType, type SVGProps } from 'react';
import { NavLink } from 'react-router-dom';
import HouseIcon from '@/assets/svg/house.svg';
import PeopleIcon from '@/assets/svg/people.svg';
import PersonIcon from '@/assets/svg/person.svg';
import TimerIcon from '@/assets/svg/timer.svg';
import { cn } from '@/utils/ts/cn';

interface BottomNavItemConfig {
  to: string;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  end?: boolean;
}

const BOTTOM_NAV_ITEMS = [
  { to: '/home', label: '홈', Icon: HouseIcon, end: true },
  { to: '/clubs', label: '동아리', Icon: PeopleIcon },
  { to: '/timer', label: '타이머', Icon: TimerIcon },
  { to: '/mypage', label: '내정보', Icon: PersonIcon },
] satisfies BottomNavItemConfig[];

function BottomNavItem({ to, label, Icon, end = false }: BottomNavItemConfig) {
  return (
    <NavLink to={to} end={end} className="flex flex-col items-center">
      {({ isActive }) => (
        <>
          <Icon className={cn('h-5 w-5', isActive ? 'text-primary-600' : 'text-indigo-100')} />
          <span className={cn(isActive ? 'text-primary-600' : 'text-indigo-100')}>{label}</span>
        </>
      )}
    </NavLink>
  );
}

function BottomNav() {
  return (
    <nav className="fixed right-0 bottom-0 left-0 z-20 rounded-[20px] border-t border-[#e0e0e0] bg-white">
      <div className="mx-auto flex min-h-[75px] max-w-md items-center justify-center gap-13 px-7 py-2 text-xs font-semibold">
        {BOTTOM_NAV_ITEMS.map((item) => (
          <BottomNavItem key={item.to} {...item} />
        ))}
      </div>
    </nav>
  );
}

export default BottomNav;
