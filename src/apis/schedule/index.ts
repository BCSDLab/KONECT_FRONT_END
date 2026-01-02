import { apiClient } from '../client';
import type { ScheduleListResponse, ScheduleRequestParams } from './entity';

export const getScheduleList = async (params: ScheduleRequestParams) => {
  const response = await apiClient.get<ScheduleListResponse, ScheduleRequestParams>('schedules', { params });
  return response;
};

export const getUpComingScheduleList = async () => {
  const response = await apiClient.get<ScheduleListResponse>('schedules/upcoming');
  return response;
};
