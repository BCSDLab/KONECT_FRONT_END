import { apiClient } from '../client';
import type { ClubRequestParams, ClubResponse, JoinClubResponse } from './entity';

export const getClubs = async (params: ClubRequestParams) => {
  const response = await apiClient.get<ClubResponse, ClubRequestParams>('clubs', { params });
  return response;
};

export const getJoinedClubs = async () => {
  const response = await apiClient.get<JoinClubResponse>('clubs/joined');
  return response;
};
