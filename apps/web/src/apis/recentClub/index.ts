import { apiClient } from '../client';
import type { RecentClubRequestParams, RecentClubResponse } from './entity';

export const getRecentClubs = async (clubIds: number[]) => {
  const response = await apiClient.get<RecentClubResponse, RecentClubRequestParams>('konect/clubs/recent', {
    params: { clubIds },
  });
  return response;
};
