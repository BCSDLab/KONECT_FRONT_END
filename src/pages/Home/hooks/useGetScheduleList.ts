import { useSuspenseQuery } from '@tanstack/react-query';
import { getScheduleList } from '@/apis/schedule';
import type { ScheduleRequestParams } from '@/apis/schedule/entity';
import { scheduleQueryKeys } from '@/pages/Schedule/hooks/useGetSchedules';

export const useGetScheduleList = (params: ScheduleRequestParams) => {
  return useSuspenseQuery({
    queryKey: scheduleQueryKeys.monthly(params),
    queryFn: () => getScheduleList(params),
  });
};
