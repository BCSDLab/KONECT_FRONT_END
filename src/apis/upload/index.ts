import { apiClient } from '../client';
import type { UploadImageResponse, UploadTarget } from './entity';

export const uploadImage = async (file: File, target: UploadTarget) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await apiClient.post<UploadImageResponse>(`upload/image?target=${target}`, {
    body: formData,
    requiresAuth: true,
  });
  return response;
};
