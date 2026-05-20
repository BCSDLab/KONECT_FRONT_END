import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';

import type { UniversityClubListRequestParams, UniversityClubListResponse } from './entity';
import { getUniversityClubs } from '.';

type UniversityClubInfiniteListParams = Omit<UniversityClubListRequestParams, 'page'>;

export const universityClubQueryKeys = {
  all: ['universityClub'] as const,
  list: (universityId: number, params: UniversityClubListRequestParams) =>
    [
      ...universityClubQueryKeys.all,
      'list',
      universityId,
      params.page ?? 1,
      params.limit ?? 12,
      params.query ?? '',
      params.category ?? '',
    ] as const,
  infinite: {
    all: () => [...universityClubQueryKeys.all, 'infinite'] as const,
    list: (universityId: number, params: UniversityClubInfiniteListParams) =>
      [
        ...universityClubQueryKeys.infinite.all(),
        universityId,
        params.limit ?? 12,
        params.query ?? '',
        params.category ?? '',
      ] as const,
  },
};

export const universityClubQueries = {
  list: (universityId: number, params: UniversityClubListRequestParams) =>
    queryOptions({
      queryKey: universityClubQueryKeys.list(universityId, params),
      queryFn: () => getUniversityClubs(universityId, params),
    }),
  infiniteList: (universityId: number, params: UniversityClubInfiniteListParams) =>
    infiniteQueryOptions({
      queryKey: universityClubQueryKeys.infinite.list(universityId, params),
      queryFn: ({ pageParam }) => getUniversityClubs(universityId, { ...params, page: pageParam }),
      initialPageParam: 1,
      getNextPageParam: (lastPage: UniversityClubListResponse) => {
        if (lastPage.currentPage < lastPage.totalPage) {
          return lastPage.currentPage + 1;
        }

        return undefined;
      },
    }),
};
