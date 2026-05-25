import { apiClient } from '../client';
import type { UniversityClubListRequestParams, UniversityClubListResponse } from './entity';

export const getUniversityClubs = async (universityId: number, params?: UniversityClubListRequestParams) => {
  const response = await apiClient.get<UniversityClubListResponse, UniversityClubListRequestParams>(
    `konect/universities/${universityId}/clubs`,
    { params }
  );
  return response;
};
