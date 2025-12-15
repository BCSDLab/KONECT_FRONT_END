import GoogleIcon from '@/assets/svg/google.svg';
import KakaoIcon from '@/assets/svg/kakao.svg';
import NaverIcon from '@/assets/svg/naver.svg';

function Login() {
  return (
    <div className="flex flex-1 flex-col justify-between p-8 pb-23">
      <div>
        <div className="text-2xl font-extrabold">모든 동아리를 연결하다</div>
        <div className="text-3xl font-black">KONECT</div>
      </div>
      <div className="flex flex-col gap-3">
        <a
          href="https://api.konect.kro.kr/oauth2/authorization/google"
          className="flex h-12 items-center justify-center gap-3 rounded-lg border border-indigo-50 bg-white"
        >
          <GoogleIcon />
          <span className="leading-6 font-extrabold">Google로 계속하기</span>
        </a>
        <a
          href="https://api.konect.kro.kr/oauth2/authorization/kakao"
          className="flex h-12 items-center justify-center gap-3 rounded-lg bg-[#FEE500]"
        >
          <KakaoIcon />
          <span className="leading-6 font-extrabold">카카오로 계속하기</span>
        </a>
        <a
          href="https://api.konect.kro.kr/oauth2/authorization/naver"
          className="flex h-12 items-center justify-center gap-3 rounded-lg bg-[#03C75A] text-white"
        >
          <NaverIcon />
          <span className="leading-6 font-extrabold">네이버로 계속하기</span>
        </a>
      </div>
    </div>
  );
}

export default Login;
