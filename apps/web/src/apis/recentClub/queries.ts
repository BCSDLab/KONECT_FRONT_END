import { queryOptions } from '@tanstack/react-query';

import { getRecentClubs } from '@/apis/recentClub';

export const recentClubQueryKeys = {
  all: ['recentClub'] as const,
  list: (clubIds: number[]) => [...recentClubQueryKeys.all, 'list', ...clubIds] as const,
};

export const recentClubQueries = {
  list: (clubIds: number[]) =>
    queryOptions({
      queryKey: recentClubQueryKeys.list(clubIds),
      queryFn: () => getRecentClubs(clubIds),
    }),
};
