import { apiClient } from '../client';
import type { UniversityListResponse } from './entity';

export const getUniversityList = async () => {
  const response = await apiClient.get<UniversityListResponse>('universities', {
    requiresAuth: true,
  });
  return response;
};
