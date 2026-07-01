import { apiClient } from '../client';
import type { ClubInformationUpdateRequest } from './entity';

export const submitClubInformationUpdateRequest = async (clubId: number, body: ClubInformationUpdateRequest) => {
  const response = await apiClient.post<null>(`konect/clubs/${clubId}/information-update-requests`, {
    body,
  });
  return response;
};
