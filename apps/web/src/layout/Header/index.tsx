import { Link, useNavigate } from 'react-router-dom';
import Logo from '@/assets/image/Logo.png';

function Header() {
  const navigate = useNavigate();
  return (
    <header className="border-text-100 border-b bg-white">
      <div className="mx-auto flex h-15 w-full max-w-279 items-center justify-between px-2 lg:h-20 lg:px-0">
        <Link className="flex h-full items-center" to="/" aria-label="Konect 홈">
          <img className="aspect-11/8 h-10 object-center mix-blend-multiply sm:h-10" src={Logo} alt="로고" />
          <span className="text-primary-500 [font-family:var(--font-cal-sans)] text-[28px] leading-9 font-normal sm:text-[32px] sm:leading-10">
            Konect
          </span>
        </Link>
        <button
          className="border-text-200 text-text-600 hover:border-primary-500 hover:text-primary-700 focus-visible:outline-primary-500 hidden h-10 shrink-0 items-center rounded-full border px-5 font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 sm:flex"
          type="button"
          onClick={() => {
            navigate('/clubs/register');
          }}
        >
          동아리 등록하기
        </button>
      </div>
    </header>
  );
}

export default Header;
