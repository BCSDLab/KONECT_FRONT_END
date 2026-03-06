import type { OAuthProvider } from '@/apis/auth/entity';

type OAuthMode = 'login' | 'link';

const API_BASE_URL = import.meta.env.VITE_API_PATH;

export const NORMALIZED_API_BASE_URL = (API_BASE_URL ?? '').replace(/\/+$/, '');

interface GetOAuthAuthorizationUrlParams {
  mode?: OAuthMode;
  provider: OAuthProvider;
  redirectUri: string;
}

export const getOAuthAuthorizationUrl = ({ mode = 'login', provider, redirectUri }: GetOAuthAuthorizationUrlParams) => {
  if (!NORMALIZED_API_BASE_URL) {
    throw new Error('API 경로 환경변수가 설정되지 않았습니다.');
  }

  const url = new URL(`${NORMALIZED_API_BASE_URL}/oauth2/authorization/${provider.toLowerCase()}`);

  url.searchParams.set('redirect_uri', redirectUri);

  if (mode === 'link') {
    url.searchParams.set('oauth_mode', 'link');
  }

  return url.toString();
};
