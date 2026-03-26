import { useSuspenseQuery } from '@tanstack/react-query';
import { getMyOAuthLinks } from '@/apis/auth';
import { OAUTH_PROVIDERS } from '@/apis/auth/entity';
import { userQueryKeys } from './useMyInfo';

export const useOAuthLinks = () => {
  const { data } = useSuspenseQuery({
    queryKey: userQueryKeys.oauthLinks(),
    queryFn: () => getMyOAuthLinks(),
  });

  const oauthLinks = OAUTH_PROVIDERS.map((provider) => ({
    provider,
    linked: data.providers.some((oauthProvider) => oauthProvider.provider === provider && oauthProvider.linked),
  }));

  return { oauthLinks };
};
