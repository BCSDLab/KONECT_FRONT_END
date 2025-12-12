import { useNavigate } from 'react-router-dom';
import GoogleIcon from '@/assets/svg/google.svg';
import KakaoIcon from '@/assets/svg/kakao.svg';
import NaverIcon from '@/assets/svg/naver.svg';

function Login() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 flex-col justify-between p-8 pb-23">
      <div>
        <div className="text-2xl font-extrabold">모든 동아리를 연결하다</div>
        <div className="text-3xl font-black">KONECT</div>
      </div>
      <div className="flex flex-col gap-3">
        <button
          onClick={() => navigate('/signup')}
          className="flex h-12 items-center justify-center gap-3 rounded-lg border border-indigo-50 bg-white"
        >
          <GoogleIcon />
          <span className="leading-6 font-extrabold">Google로 계속하기</span>
        </button>
        <button className="flex h-12 items-center justify-center gap-3 rounded-lg bg-[#FEE500]">
          <KakaoIcon />
          <span className="leading-6 font-extrabold">카카오로 계속하기</span>
        </button>
        <button className="flex h-12 items-center justify-center gap-3 rounded-lg bg-[#03C75A] text-white">
          <NaverIcon />
          <span className="leading-6 font-extrabold">네이버로 계속하기</span>
        </button>
      </div>
    </div>
  );
}

export default Login;
