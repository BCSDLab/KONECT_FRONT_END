import { queryOptions } from '@tanstack/react-query';

import type { HomeRequestParams } from './entity';
import { getHome } from '.';

export const homeQueryKeys = {
  all: ['home'] as const,
  detail: (params: HomeRequestParams) => [...homeQueryKeys.all, params.query ?? '', params.region ?? ''] as const,
};

export const homeQueries = {
  detail: (params: HomeRequestParams) =>
    queryOptions({
      queryKey: homeQueryKeys.detail(params),
      queryFn: () => getHome(params),
    }),
};
