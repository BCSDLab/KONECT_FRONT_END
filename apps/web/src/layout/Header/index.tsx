import Logo from '@/assets/image/Logo.png';

function Header() {
  return (
    <header className="border-text-100 border-b bg-white">
      <div className="mx-auto flex h-18 w-full max-w-370 items-center justify-between px-2 sm:h-21 lg:px-10">
        <a className="flex items-center" href="/" aria-label="Konect 홈">
          <img className="w-16 object-center mix-blend-multiply sm:h-13.5 sm:w-18.5" src={Logo} alt="로고" />
          <span className="text-primary-500 [font-family:var(--font-cal-sans)] text-[28px] leading-9 font-normal sm:text-[36px] sm:leading-10">
            Konect
          </span>
        </a>
        <button
          className="border-text-200 text-text-600 hover:border-primary-500 hover:text-primary-700 focus-visible:outline-primary-500 hidden h-14 shrink-0 rounded-full border px-7 text-[20px] leading-10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 sm:block"
          type="button"
        >
          동아리 등록하기
        </button>
      </div>
    </header>
  );
}

export default Header;
