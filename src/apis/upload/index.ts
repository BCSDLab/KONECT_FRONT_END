import { apiClient } from '../client';
import type { UploadImageResponse } from './entity';

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await apiClient.post<UploadImageResponse>('upload/image', {
    body: formData,
    requiresAuth: true,
  });
  return response;
};
