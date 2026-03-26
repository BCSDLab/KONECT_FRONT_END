import { useQuery } from '@tanstack/react-query';
import type { ScheduleRequestParams } from '@/apis/schedule/entity';
import { scheduleQueries } from '@/apis/schedule/queries';

export const useScheduleList = (params: ScheduleRequestParams) => {
  return useQuery({
    ...scheduleQueries.monthly(params),
    enabled: Boolean(params.year && params.month),
  });
};
