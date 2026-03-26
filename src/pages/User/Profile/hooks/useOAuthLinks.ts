import { useSuspenseQuery } from '@tanstack/react-query';
import { OAUTH_PROVIDERS } from '@/apis/auth/entity';
import { authQueries } from '@/apis/auth/queries';

export const useOAuthLinks = () => {
  const { data } = useSuspenseQuery(authQueries.oauthLinks());

  const oauthLinks = OAUTH_PROVIDERS.map((provider) => ({
    provider,
    linked: data.providers.some((oauthProvider) => oauthProvider.provider === provider && oauthProvider.linked),
  }));

  return { oauthLinks };
};
