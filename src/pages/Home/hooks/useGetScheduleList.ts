import { useSuspenseQuery } from '@tanstack/react-query';
import { getScheduleList } from '@/apis/schedule';
import type { ScheduleRequestParams } from '@/apis/schedule/entity';

export const useGetScheduleList = (params: ScheduleRequestParams) => {
  return useSuspenseQuery({
    queryKey: ['scheduleList', params.year, params.month],
    queryFn: () => getScheduleList(params),
  });
};
