import { apiClient } from '../client';
import type { ModifyMyInfoRequest, MyInfoResponse, RefreshTokenResponse, SignupRequest } from './entity';

const BASE_URL = import.meta.env.VITE_API_PATH;

export const refreshAccessToken = async (): Promise<string> => {
  const url = `${BASE_URL.replace(/\/+$/, '')}/users/refresh`;
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('토큰 갱신 실패');
  }

  const data: RefreshTokenResponse = await response.json();
  return data.accessToken;
};

export const signup = async (data: SignupRequest) => {
  const response = await apiClient.post('users/signup', {
    body: data,
    requiresAuth: true,
  });
  return response;
};

export const getMyInfo = async () => {
  const response = await apiClient.get<MyInfoResponse>('users/me', {
    requiresAuth: true,
  });
  return response;
};

export const logout = async () => {
  const response = await apiClient.post('users/logout', {
    requiresAuth: true,
  });
  return response;
};

export const putMyInfo = async (data: ModifyMyInfoRequest) => {
  const response = await apiClient.put('users/me', {
    body: data,
    requiresAuth: true,
  });
  return response;
};

export const deleteMyAccount = async () => {
  const response = await apiClient.delete('users/withdraw', {
    requiresAuth: true,
  });
  return response;
};
