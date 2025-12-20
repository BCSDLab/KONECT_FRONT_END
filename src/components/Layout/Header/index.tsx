import { useLocation, useNavigate } from 'react-router-dom';
import BellIcon from '@/assets/svg/bell.svg';
import ChevronLeftIcon from '@/assets/svg/chevron-left.svg';
import { useMyInfo } from '@/pages/Profile/hooks/useMyInfo';
import { ROUTE_TITLES } from './routeTitles';

const INFO_HEADER_LIST = ['/home', '/council'];

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
      <BellIcon />
    </header>
  );
}

function ProfileHeader() {
  return (
    <header className="fixed top-0 right-0 left-0 flex h-11 items-center justify-end bg-white px-4 py-2 shadow-[0_1px_1px_0_rgba(0,0,0,0.04)]">
      <BellIcon />
    </header>
  );
}

function DefaultHeader({ title }: { title: string }) {
  const navigate = useNavigate();

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

  return <DefaultHeader title={title} />;
}

export default Header;
