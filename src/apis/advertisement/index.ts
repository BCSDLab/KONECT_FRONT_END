import { apiClient } from '../client';
import type { AdvertisementsRequestParams, AdvertisementsResponse } from './entity';

export const getAdvertisements = async (params: AdvertisementsRequestParams = {}) => {
  const response = await apiClient.get<AdvertisementsResponse, AdvertisementsRequestParams>('advertisements', {
    params,
    requiresAuth: true,
  });

  return response;
};

export const postAdvertisementClick = async (advertisementId: number) => {
  const response = await apiClient.post<void>(`advertisements/${advertisementId}/clicks`, {
    requiresAuth: true,
  });

  return response;
};
