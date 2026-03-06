import AppleIcon from '@/assets/svg/apple.svg';
import GoogleIcon from '@/assets/svg/google.svg';
import KakaoIcon from '@/assets/svg/kakao.svg';
import NaverIcon from '@/assets/svg/naver.svg';
import { getOAuthAuthorizationUrl } from '@/utils/ts/oauth';

function getRedirectUri() {
  if (import.meta.env.DEV) return window.location.origin;
  return `${window.location.origin}/home`;
}

const SOCIAL_LOGIN_LIST = [
  { provider: 'GOOGLE', label: 'Google로 로그인', icon: GoogleIcon, className: 'border border-gray-200 bg-white' },
  { provider: 'KAKAO', label: '카카오로 로그인', icon: KakaoIcon, className: 'bg-[#FEE500]' },
  { provider: 'NAVER', label: '네이버로 로그인', icon: NaverIcon, className: 'bg-[#03C75A]' },
  { provider: 'APPLE', label: 'Apple로 로그인', icon: AppleIcon, className: 'bg-black' },
] as const;

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
              href={getOAuthAuthorizationUrl({ provider, redirectUri: getRedirectUri() })}
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
