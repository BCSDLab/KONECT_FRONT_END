import { apiClient } from '../client';

export const registerPushToken = async (token: string) => {
  const response = await apiClient.post('notifications/tokens', {
    body: { token },
    requiresAuth: true,
  });
  return response;
};

export const getNotificationToken = async (): Promise<{ token: string }> => {
  const response = await apiClient.get<{ token: string }>('notifications/tokens', {
    requiresAuth: true,
  });
  return response;
};
