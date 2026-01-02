import { useSuspenseQuery } from '@tanstack/react-query';
import { getUpComingScheduleList } from '@/apis/schedule';

export const useGetUpComingScheduleList = () => {
  return useSuspenseQuery({
    queryKey: ['scheduleList'],
    queryFn: () => getUpComingScheduleList(),
  });
};
