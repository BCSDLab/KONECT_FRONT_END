import { apiClient } from '../client';
import type { InquiryRequest } from './entity';

export const postInquiry = async (data: InquiryRequest) => {
  const response = await apiClient.post('inquiries', {
    body: data,
  });
  return response;
};
