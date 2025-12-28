import { useSuspenseQuery } from '@tanstack/react-query';
import { getCouncilInfo } from '@/apis/council';

export const useGetCouncilInfo = () => {
  return useSuspenseQuery({
    queryKey: ['councilInfo'],
    queryFn: () => getCouncilInfo(),
  });
};
