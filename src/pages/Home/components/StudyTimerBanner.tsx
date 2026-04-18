import { Link } from 'react-router-dom';
import GlassCatImage from '@/assets/image/glass_cat.png';

function StudyTimerBanner() {
  return (
    <Link
      to="/timer"
      aria-label="커넥트 타이머 이벤트 배너"
      className="relative block h-36 rounded-xl p-6"
      style={{
        backgroundImage: 'linear-gradient(0deg, #f2fff6 0%, #d0eedd 93.58%)',
      }}
    >
      <div className="relative z-10 max-w-36.25 text-[#324839]">
        <h2 className="text-[18px] leading-[1.6] font-extrabold tracking-[-0.18px] break-keep">
          <span className="block whitespace-nowrap">Konect와 공부하고</span>
          <span className="block whitespace-nowrap">핫식스 받자!</span>
        </h2>
        <p className="mt-0.75 text-[10px] leading-[1.6] font-medium break-keep whitespace-pre-line">
          커넥트의 타이머 기능을{'\n'}사용해보세요!
        </p>
      </div>

      <img
        src={GlassCatImage}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -top-0.5 right-0.5 size-43.5 object-contain drop-shadow-[0_12px_24px_rgba(50,72,57,0.12)]"
      />
    </Link>
  );
}

export default StudyTimerBanner;
