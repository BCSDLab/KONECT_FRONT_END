import { useSuspenseQuery } from '@tanstack/react-query';
import { getUniversityList } from '@/apis/university';

export const useGetUniversityList = () => {
  return useSuspenseQuery({
    queryKey: ['universityList'],
    queryFn: () => getUniversityList(),
  });
};
