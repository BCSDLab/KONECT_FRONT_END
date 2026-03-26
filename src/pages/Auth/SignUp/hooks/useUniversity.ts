import { useSuspenseQuery } from '@tanstack/react-query';
import { getUniversityList } from '@/apis/university';

export const universityQueryKeys = {
  all: ['university'],
  list: () => [...universityQueryKeys.all, 'list'],
};

export const useGetUniversityList = () => {
  return useSuspenseQuery({
    queryKey: universityQueryKeys.list(),
    queryFn: () => getUniversityList(),
  });
};
