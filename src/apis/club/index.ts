import { apiClient } from '../client';
import type { ClubRequestParams, ClubResponse } from './entity';

export const getClubs = async (params: ClubRequestParams) => {
  const response = await apiClient.get<ClubResponse, ClubRequestParams>('clubs', { params });
  return response;
};
