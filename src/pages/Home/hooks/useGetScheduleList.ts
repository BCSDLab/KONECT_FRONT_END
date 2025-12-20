import { useSuspenseQuery } from '@tanstack/react-query';
import { getScheduleList } from '@/apis/schedule';

export const useGetScheduleList = () => {
  return useSuspenseQuery({
    queryKey: ['scheduleList'],
    queryFn: () => getScheduleList(),
  });
};
