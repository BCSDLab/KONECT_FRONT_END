import { apiClient } from '../client';
import type { SignupRequest } from './entity';

export const postSignup = async (data: SignupRequest) => {
  const response = await apiClient.post('/users/signup', {
    body: data,
  });
  return response;
};
