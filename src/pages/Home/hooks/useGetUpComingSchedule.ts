import { useSuspenseQuery } from '@tanstack/react-query';
import { getUpComingScheduleList } from '@/apis/schedule';
import { scheduleQueryKeys } from '@/pages/Schedule/hooks/useGetSchedules';

export const useGetUpComingScheduleList = () => {
  return useSuspenseQuery({
    queryKey: scheduleQueryKeys.upcoming(),
    queryFn: () => getUpComingScheduleList(),
  });
};
