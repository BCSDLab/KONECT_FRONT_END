import { apiClient } from '../client';
import type { ClubDetailResponse } from './entity';

export const getClubDetail = async (clubId: number) => {
  const response = await apiClient.get<ClubDetailResponse>(`konect/clubs/${clubId}`);
  return response;
};
