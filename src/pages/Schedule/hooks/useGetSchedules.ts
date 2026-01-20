import { useQuery } from '@tanstack/react-query';
import type { ScheduleListResponse, ScheduleRequestParams } from '@/apis/schedule/entity';
import { getScheduleList } from '@/apis/schedule/index';

export const scheduleQueryKeys = {
  all: ['schedules'],
  monthly: (params: ScheduleRequestParams) => [...scheduleQueryKeys.all, 'monthly', params.year, params.month],
  upcoming: () => [...scheduleQueryKeys.all, 'upcoming'],
};

export const useScheduleList = (params: ScheduleRequestParams) => {
  return useQuery<ScheduleListResponse>({
    queryKey: scheduleQueryKeys.monthly(params),
    queryFn: () => getScheduleList(params),
    enabled: Boolean(params.year && params.month),
  });
};
