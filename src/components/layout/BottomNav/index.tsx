import clsx from 'clsx';
import { useLocation, Link } from 'react-router-dom';
import HouseIcon from '@/assets/svg/house.svg';
import PeopleIcon from '@/assets/svg/people.svg';
import PersonIcon from '@/assets/svg/person.svg';
import TimerIcon from '@/assets/svg/timer.svg';

function BottomNav() {
  const { pathname } = useLocation();

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-20 border-t border-[#e0e0e0] bg-white">
      <div className="mx-auto flex min-h-[75px] max-w-md items-center justify-between px-7 py-2 text-xs font-semibold">
        <Link to="/home" className="flex flex-col items-center">
          <HouseIcon className={clsx('h-5 w-5', pathname === '/home' ? 'text-primary' : 'text-indigo-100')} />
          <span className={clsx(pathname === '/home' ? 'text-primary' : 'text-indigo-100')}>홈</span>
        </Link>

        <Link to="/council" className="flex flex-col items-center">
          <PeopleIcon
            className={clsx('h-5 w-5', pathname.startsWith('/council') ? 'text-primary' : 'text-indigo-100')}
          />
          <span className={clsx(pathname.startsWith('/council') ? 'text-primary' : 'text-indigo-100')}>총동연</span>
        </Link>

        <Link to="/timer" className="flex flex-col items-center">
          <TimerIcon className={clsx('h-5 w-5', pathname.startsWith('/timer') ? 'text-primary' : 'text-indigo-100')} />
          <span className={clsx(pathname.startsWith('/timer') ? 'text-primary' : 'text-indigo-100')}>모집</span>
        </Link>

        <Link to="/me" className="flex flex-col items-center">
          <PersonIcon className={clsx('h-5 w-5', pathname.startsWith('/me') ? 'text-primary' : 'text-indigo-100')} />
          <span className={clsx(pathname.startsWith('/me') ? 'text-primary' : 'text-indigo-100')}>내정보</span>
        </Link>
      </div>
    </nav>
  );
}

export default BottomNav;
