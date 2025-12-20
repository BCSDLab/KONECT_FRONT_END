import { apiClient } from '../client';
import type { ScheduleListResponse } from './entity';

export const getScheduleList = async () => {
  const response = await apiClient.get<ScheduleListResponse>('schedules');
  return response;
};
