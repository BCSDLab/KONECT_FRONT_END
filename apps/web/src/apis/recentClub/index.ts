import { apiClient } from '@/apis/client';

import type { RecentClubListRequestParams, RecentClubListResponse } from './entity';

export const getRecentClubs = async (clubIds: number[]) => {
  const response = await apiClient.get<RecentClubListResponse, RecentClubListRequestParams>('konect/clubs/recent', {
    params: { clubIds },
  });
  return response;
};
