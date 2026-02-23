import { apiClient } from '../client';

export const registerPushToken = async (token: string) => {
  const response = await apiClient.post('notifications/tokens', {
    body: { token },
    requiresAuth: true,
  });
  return response;
};
