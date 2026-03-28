import type { ComponentType, SVGAttributes } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import type { OAuthProvider } from '@/apis/auth/entity';
import { authQueries } from '@/apis/auth/queries';
import AppleFigmaIcon from '@/assets/svg/apple-figma.svg';
import GoogleIcon from '@/assets/svg/google.svg';
import KakaoIcon from '@/assets/svg/kakao.svg';
import NaverIcon from '@/assets/svg/naver.svg';
import BottomModal from '@/components/common/BottomModal';
import useBooleanState from '@/utils/hooks/useBooleanState';
import { cn } from '@/utils/ts/cn';
import { getOAuthAuthorizationUrl } from '@/utils/ts/oauth';
import { useAdminChatMutation } from '../hooks/useAdminChatMutation';
import { useWithdrawMutation } from '../MyPage/hooks/useWithdraw';
import { useOAuthLinks } from './hooks/useOAuthLinks';

const fields = [
  { label: '학교명', name: 'universityName' },
  { label: '이메일', name: 'email' },
  { label: '이름', name: 'name' },
  { label: '학번', name: 'studentNumber' },
] as const;

interface OAuthProviderConfig {
  icon: ComponentType<SVGAttributes<SVGElement>>;
  iconClassName: string;
  label: string;
  linkedButtonClassName: string;
  linkedIconClassName?: string;
}

const ICON_WHITE_FILL_CLASS_NAME = '[&_path]:fill-indigo-0';

const OAUTH_PROVIDER_CONFIGS: Record<OAuthProvider, OAuthProviderConfig> = {
  GOOGLE: {
    icon: GoogleIcon,
    iconClassName: 'h-[19px] w-[18px]',
    label: 'Google',
    linkedButtonClassName: 'border border-[#b9b9b9] bg-white',
  },
  KAKAO: {
    icon: KakaoIcon,
    iconClassName: 'h-[30px] w-[30px]',
    label: '카카오',
    linkedButtonClassName: 'bg-[#FEE500]',
  },
  NAVER: {
    icon: NaverIcon,
    iconClassName: 'h-[25px] w-[25px]',
    label: '네이버',
    linkedButtonClassName: 'bg-[#03C75A]',
    linkedIconClassName: ICON_WHITE_FILL_CLASS_NAME,
  },
  APPLE: {
    icon: AppleFigmaIcon,
    iconClassName: 'h-[30px] w-[25px]',
    label: 'Apple',
    linkedButtonClassName: 'bg-primary',
  },
};

function getOAuthLinkRedirectUri() {
  return new URL('/profile', window.location.origin).toString();
}

interface OAuthLinkButtonProps {
  linked: boolean;
  onLink: (provider: OAuthProvider) => void;
  provider: OAuthProvider;
}

function OAuthLinkButton({ linked, onLink, provider }: OAuthLinkButtonProps) {
  const {
    icon: Icon,
    iconClassName,
    label,
    linkedButtonClassName,
    linkedIconClassName,
  } = OAUTH_PROVIDER_CONFIGS[provider];

  return (
    <button
      type="button"
      disabled={linked}
      onClick={() => onLink(provider)}
      aria-label={linked ? `${label} 연동 완료` : `${label} 연동하기`}
      className={cn(
        'flex h-[52px] w-[52px] items-center justify-center rounded-full transition-colors disabled:cursor-default disabled:opacity-100',
        linked ? linkedButtonClassName : 'bg-indigo-25'
      )}
    >
      <Icon className={cn(iconClassName, linked ? linkedIconClassName : ICON_WHITE_FILL_CLASS_NAME)} />
    </button>
  );
}

function Profile() {
  const { data: myInfo } = useSuspenseQuery(authQueries.myInfo());
  const { oauthLinks } = useOAuthLinks();
  const { mutate: withdraw, isPending: isWithdrawing } = useWithdrawMutation();

  const { value: isOpen, setTrue: openModal, setFalse: closeModal } = useBooleanState(false);
  const { mutate: goToAdminChat, isPending: isCreatingAdminChat } = useAdminChatMutation();

  const handleOAuthLink = (provider: OAuthProvider) => {
    window.location.assign(
      getOAuthAuthorizationUrl({ mode: 'link', provider, redirectUri: getOAuthLinkRedirectUri() })
    );
  };

  return (
    <div className="flex flex-1 flex-col bg-white px-5 pt-6 pb-10">
      <div className="flex flex-col gap-2">
        {fields.map(({ label, name }) => (
          <div key={name} className="flex flex-col gap-1">
            <label className="text-[15px] leading-6 font-medium text-indigo-300">{label}</label>
            <input
              name={name}
              value={myInfo?.[name] ?? ''}
              disabled
              className="bg-indigo-5 rounded-lg p-2 text-[15px] leading-6 font-semibold disabled:text-indigo-200"
            />
          </div>
        ))}
        <div className="text-end text-[10px] leading-3 font-medium text-indigo-300">
          정보 수정은 관리자에게 문의해주세요
        </div>
        <div className="flex justify-end text-[10px] leading-3 font-medium text-indigo-300">
          <button type="button" onClick={openModal} className="text-[#3182f6]">
            탈퇴
          </button>
          <span>를 원하시나요?</span>
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-[50px]">
        <div className="flex justify-center gap-5">
          {oauthLinks.map(({ provider, linked }) => (
            <OAuthLinkButton key={provider} linked={linked} onLink={handleOAuthLink} provider={provider} />
          ))}
        </div>

        <button
          type="button"
          disabled={isCreatingAdminChat}
          onClick={() => goToAdminChat()}
          className="bg-primary text-indigo-5 w-full rounded-lg py-2.5 text-center text-lg leading-7 font-bold disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isCreatingAdminChat ? '이동 중...' : '문의하기'}
        </button>
      </div>

      <BottomModal isOpen={isOpen} onClose={closeModal}>
        <div className="flex flex-col gap-10 px-8 pt-7 pb-4">
          <div className="text-h3 text-center whitespace-pre-wrap">
            정말로 탈퇴하시겠어요?{'\n'}탈퇴 후 코넥트의 기능을 사용할 수 없어요
          </div>
          <div>
            <button
              disabled={isWithdrawing}
              onClick={() => withdraw()}
              className="bg-primary text-h3 w-full rounded-lg py-3.5 text-center text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isWithdrawing ? '탈퇴 처리 중...' : '탈퇴하기'}
            </button>
            <button onClick={closeModal} className="text-h3 w-full rounded-lg py-3.5 text-center text-indigo-400">
              취소
            </button>
          </div>
        </div>
      </BottomModal>
    </div>
  );
}

export default Profile;
