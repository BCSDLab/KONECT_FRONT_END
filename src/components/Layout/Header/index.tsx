import { useLocation, useNavigate } from 'react-router-dom';
import ChevronLeftIcon from '@/assets/svg/chevron-left.svg';
import { ROUTE_TITLES } from './routeTitles';

function Header() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const title = ROUTE_TITLES.find((route) => route.match(pathname))?.title ?? '';
  return (
    <div className="fixed top-0 right-0 left-0 flex h-11 items-center justify-center bg-white px-4 py-2">
      <button
        type="button"
        aria-label="뒤로가기"
        onClick={() => navigate(-1)}
        className="absolute top-1/2 left-4 -translate-y-1/2"
      >
        <ChevronLeftIcon />
      </button>
      <span className="text-lg">{title}</span>
    </div>
  );
}

export default Header;
