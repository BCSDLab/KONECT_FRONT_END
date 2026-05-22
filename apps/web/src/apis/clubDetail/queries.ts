import { queryOptions } from '@tanstack/react-query';

import { getClubDetail } from '@/apis/clubDetail';

export const clubDetailQueryKeys = {
  all: ['clubDetail'] as const,
  detail: (clubId: number) => [...clubDetailQueryKeys.all, clubId] as const,
};

export const clubDetailQueries = {
  detail: (clubId: number) =>
    queryOptions({
      queryKey: clubDetailQueryKeys.detail(clubId),
      queryFn: () => getClubDetail(clubId),
    }),
};
