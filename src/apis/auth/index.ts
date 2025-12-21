import { apiClient } from '../client';
import type { ModifyMyInfoRequest, MyInfoResponse, SignupRequest } from './entity';

export const signup = async (data: SignupRequest) => {
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

export const logout = async () => {
  const response = await apiClient.post('/users/logout', {
    requiresAuth: true,
  });
  return response;
};

export const putMyInfo = async (data: ModifyMyInfoRequest) => {
  const response = await apiClient.put('/users/me', {
    body: data,
    requiresAuth: true,
  });
  return response;
};
