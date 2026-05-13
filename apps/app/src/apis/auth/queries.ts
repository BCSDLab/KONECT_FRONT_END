import { queryOptions } from '@tanstack/react-query';
import { getMyInfo, getMyOAuthLinks, getSignupPrefill } from '.';

export const authQueryKeys = {
  all: ['user'] as const,
  myInfo: () => [...authQueryKeys.all, 'myInfo'] as const,
  oauthLinks: () => [...authQueryKeys.all, 'oauthLinks'] as const,
  signupPrefill: () => [...authQueryKeys.all, 'prefill'] as const,
};

export const authQueries = {
  myInfo: () =>
    queryOptions({
      queryKey: authQueryKeys.myInfo(),
      queryFn: getMyInfo,
    }),
  oauthLinks: () =>
    queryOptions({
      queryKey: authQueryKeys.oauthLinks(),
      queryFn: getMyOAuthLinks,
    }),
  signupPrefill: () =>
    queryOptions({
      queryKey: authQueryKeys.signupPrefill(),
      queryFn: getSignupPrefill,
    }),
};
