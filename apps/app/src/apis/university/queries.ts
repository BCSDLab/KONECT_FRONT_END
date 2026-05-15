import { queryOptions } from '@tanstack/react-query';
import { getUniversityList } from '.';

export const universityQueryKeys = {
  all: ['university'] as const,
  list: () => [...universityQueryKeys.all, 'list'] as const,
};

export const universityQueries = {
  list: () =>
    queryOptions({
      queryKey: universityQueryKeys.list(),
      queryFn: getUniversityList,
    }),
};
