import { useLocation, useNavigate } from 'react-router-dom';
import BellIcon from '@/assets/svg/bell.svg';
import ChevronLeftIcon from '@/assets/svg/chevron-left.svg';
import { ROUTE_TITLES } from './routeTitles';

function Header() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const title = ROUTE_TITLES.find((route) => route.match(pathname))?.title ?? '';
  const infoHeaderList = ['/', '/council'];

  return (
    <>
      {infoHeaderList.includes(pathname) ? (
        <header className="fixed top-0 right-0 left-0 flex items-center bg-white px-3 py-2 shadow-[0_2px_2px_0_rgba(0,0,0,0.02)]">
          <div className="flex flex-1 flex-col gap-1">
            <div className="text-sm leading-4 font-semibold text-indigo-700">한국기술교육대학교</div>
            <div className="text-[10px] leading-3 text-indigo-300">김혜준 2022136039</div>
          </div>
          <BellIcon />
        </header>
      ) : (
        <header className="fixed top-0 right-0 left-0 flex h-11 items-center justify-center bg-white px-4 py-2 shadow-[0_1px_1px_0_rgba(0,0,0,0.04)]">
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
      )}
    </>
  );
}

export default Header;
