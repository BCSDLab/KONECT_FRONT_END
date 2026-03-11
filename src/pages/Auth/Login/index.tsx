import AppleFigmaIcon from '@/assets/svg/apple-figma.svg';
import ChatCatIcon from '@/assets/svg/chat-cat.svg';
import GoogleIcon from '@/assets/svg/google.svg';
import KakaoIcon from '@/assets/svg/kakao.svg';
import NaverIcon from '@/assets/svg/naver.svg';
import { cn } from '@/utils/ts/cn';
import { getOAuthAuthorizationUrl } from '@/utils/ts/oauth';

function getRedirectUri() {
  if (import.meta.env.DEV) return window.location.origin;
  return `${window.location.origin}/home`;
}

const SOCIAL_LOGIN_LIST = [
  {
    provider: 'GOOGLE',
    label: 'Google로 로그인',
    icon: GoogleIcon,
    buttonClassName: 'size-[52px] border-[0.3px] border-[#B9B9B9] bg-white',
    iconClassName: 'left-[14px] top-[14px] size-[25px]',
  },
  {
    provider: 'KAKAO',
    label: '카카오로 로그인',
    icon: KakaoIcon,
    buttonClassName: 'size-[52px] bg-[#FEE500]',
    iconClassName: 'left-3 top-3 size-[30px]',
  },
  {
    provider: 'NAVER',
    label: '네이버로 로그인',
    icon: NaverIcon,
    buttonClassName: 'h-[52px] w-[53px] bg-[#03C75A]',
    iconClassName: 'left-[14px] top-[13px] size-[25px]',
  },
  {
    provider: 'APPLE',
    label: 'Apple로 로그인',
    icon: AppleFigmaIcon,
    buttonClassName: 'size-[52px] bg-[#323532]',
    iconClassName: 'left-[13px] top-[9px] h-[30px] w-[25px]',
  },
] as const;

const LOGIN_HERO_LINES = ['모든 동아리 활동을', '한 곳에서'] as const;

function Login() {
  return (
    <div className="bg-primary-500 flex min-h-full flex-1 flex-col px-8 pt-6 pb-[calc(72px+var(--sab))] text-white">
      <div className="flex w-[239px] flex-col gap-2">
        <div className="flex flex-col">
          {LOGIN_HERO_LINES.map((line) => (
            <p key={line} className="text-[32px] leading-10 font-extrabold">
              {line}
            </p>
          ))}
        </div>
        <p
          className="w-[239px] text-[48px] leading-10 tracking-[-0.04em]"
          style={{ fontFamily: "'Tilt Neon', var(--font-suit)" }}
        >
          Konect
        </p>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 pb-8">
        <div className="relative h-[151px] w-[181px]">
          <div className="absolute inset-x-4 bottom-3 h-6 rounded-full bg-[#4F9CB7]/40 blur-[10px]" aria-hidden />
          <ChatCatIcon aria-hidden className="relative size-full drop-shadow-[0_10px_14px_rgba(15,74,99,0.18)]" />
        </div>
      </div>

      <div className="flex w-[293px] items-center justify-between self-center">
        {SOCIAL_LOGIN_LIST.map(({ provider, label, icon: Icon, buttonClassName, iconClassName }) => (
          <a
            key={provider}
            href={getOAuthAuthorizationUrl({ provider, redirectUri: getRedirectUri() })}
            className={cn(
              'relative overflow-hidden rounded-full transition-transform active:scale-[0.96]',
              buttonClassName
            )}
            aria-label={label}
          >
            <span className={cn('absolute', iconClassName)}>
              <Icon className="size-full" />
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

export default Login;
