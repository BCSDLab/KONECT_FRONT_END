import { apiClient } from '../client';
import type { MyInfoResponse, SignupRequest } from './entity';

export const postSignup = async (data: SignupRequest) => {
  const response = await apiClient.post('/users/signup', {
    body: data,
    requiresAuth: true,
  });
  return response;
};

export const getMyInfo = async () => {
  const response = await apiClient.get<MyInfoResponse>('/users/me', {
    requiresAuth: true,
  });
  return response;
};
