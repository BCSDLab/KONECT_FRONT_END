import { apiClient } from '../client';
import type { ClubRegistrationRequest } from './entity';

export const submitClubRegistrationRequest = async (body: ClubRegistrationRequest) => {
  const response = await apiClient.post<null>('clubs/registration-requests', {
    body,
  });
  return response;
};
