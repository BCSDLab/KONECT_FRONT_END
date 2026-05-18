import { apiClient } from '../client';
import type { HomeRequestParams, HomeResponse } from './entity';

export const getHome = async (params?: HomeRequestParams) => {
  const response = await apiClient.get<HomeResponse, HomeRequestParams>('konect/home', { params });
  return response;
};
