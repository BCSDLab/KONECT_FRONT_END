import { apiClient } from '../client';
import type { NoticeRequestParams, NoticeResponse } from './entity';

export const getCouncilNotice = async (params: NoticeRequestParams) => {
  const response = await apiClient.get<NoticeResponse, NoticeRequestParams>('councils/notices', { params });
  return response;
};
