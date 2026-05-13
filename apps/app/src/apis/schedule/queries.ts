import { queryOptions } from '@tanstack/react-query';
import type { ScheduleRequestParams } from './entity';
import { getScheduleList, getUpComingScheduleList } from '.';

export const scheduleQueryKeys = {
  all: ['schedules'] as const,
  monthly: (params: ScheduleRequestParams) => [...scheduleQueryKeys.all, 'monthly', params.year, params.month] as const,
  upcoming: () => [...scheduleQueryKeys.all, 'upcoming'] as const,
};

export const scheduleQueries = {
  monthly: (params: ScheduleRequestParams) =>
    queryOptions({
      queryKey: scheduleQueryKeys.monthly(params),
      queryFn: () => getScheduleList(params),
    }),
  upcoming: () =>
    queryOptions({
      queryKey: scheduleQueryKeys.upcoming(),
      queryFn: getUpComingScheduleList,
    }),
};
