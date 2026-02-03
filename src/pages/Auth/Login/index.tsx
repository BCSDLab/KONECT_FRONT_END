import AppleIcon from '@/assets/svg/apple.svg';
import GoogleIcon from '@/assets/svg/google.svg';
import KakaoIcon from '@/assets/svg/kakao.svg';
import NaverIcon from '@/assets/svg/naver.svg';

const WEB_REDIRECT_URI = import.meta.env.PROD ? 'https://agit.gg/home' : 'http://localhost:3000';
const IOS_APP_REDIRECT_URI = 'konect://oauth/callback';

function isPWAShellIOS() {
  const ua = navigator.userAgent || '';
  // 너 WebView.swift에서 userAgent 끝에 "PWAShell" 붙여놨지? 그걸로 판별하면 확실함.
  // webView.customUserAgent = "... Safari/604.1 PWAShell"
  const isShell = ua.includes('PWAShell');
  const isIOS = /iPhone|iPad|iPod/i.test(ua);
  return isIOS && isShell;
}

const REDIRECT_URI = import.meta.env.PROD && isPWAShellIOS() ? IOS_APP_REDIRECT_URI : WEB_REDIRECT_URI;

const SOCIAL_LOGIN_LIST = [
  { provider: 'google', label: 'Google로 로그인', icon: GoogleIcon, className: 'border border-gray-200 bg-white' },
  { provider: 'kakao', label: '카카오로 로그인', icon: KakaoIcon, className: 'bg-[#FEE500]' },
  { provider: 'naver', label: '네이버로 로그인', icon: NaverIcon, className: 'bg-[#03C75A]' },
  { provider: 'apple', label: 'Apple로 로그인', icon: AppleIcon, className: 'bg-black' },
];

function Login() {
  const encodedRedirect = encodeURIComponent(REDIRECT_URI);

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
              href={`https://api.agit.gg/oauth2/authorization/${provider}?redirect_uri=${encodedRedirect}`}
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
