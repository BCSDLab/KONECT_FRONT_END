import AppleIcon from '@/assets/svg/apple.svg';
import GoogleIcon from '@/assets/svg/google.svg';
import KakaoIcon from '@/assets/svg/kakao.svg';
import NaverIcon from '@/assets/svg/naver.svg';

const REDIRECT_URI = import.meta.env.PROD ? 'https://agit.gg/home' : 'http://localhost:3000';

const SOCIAL_LOGIN_LIST = [
  {
    provider: 'google',
    label: 'Google로 로그인',
    icon: GoogleIcon,
    className: 'border border-gray-200 bg-white',
  },
  {
    provider: 'kakao',
    label: '카카오로 로그인',
    icon: KakaoIcon,
    className: 'bg-[#FEE500]',
  },
  {
    provider: 'naver',
    label: '네이버로 로그인',
    icon: NaverIcon,
    className: 'bg-[#03C75A]',
  },
  {
    provider: 'apple',
    label: 'Apple로 로그인',
    icon: AppleIcon,
    className: 'bg-black',
  },
];

function Login() {
  return (
    <div className="flex flex-1 flex-col justify-between p-8 pb-23">
      <div>
        <div className="text-2xl font-extrabold whitespace-pre-wrap">모든 동아리를{'\n'}하나로 연결하다</div>
        <div className="text-4xl font-black">KONECT</div>
      </div>
      <div className="flex flex-col items-center gap-4">
        <span className="text-sm text-gray-500">소셜 계정으로 로그인</span>
        <div className="flex gap-8">
          {SOCIAL_LOGIN_LIST.map(({ provider, label, icon: Icon, className }) => (
            <a
              key={provider}
              href={`https://api.agit.gg/oauth2/authorization/${provider}?redirect_uri=${REDIRECT_URI}`}
              className={`flex h-11 w-11 items-center justify-center rounded-full ${className}`}
              aria-label={label}
            >
              <Icon />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Login;
