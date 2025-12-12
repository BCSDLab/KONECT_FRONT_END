import { apiClient } from '../client';
import type { CouncilResponse, NoticeRequestParams, NoticeResponse } from './entity';

export const getCouncilNotice = async (params: NoticeRequestParams) => {
  const response = await apiClient.get<NoticeResponse, NoticeRequestParams>('councils/notices', { params });
  return response;
};

export const getCouncilInfo = async () => {
  const response = await apiClient.get<CouncilResponse>('councils');
  return response;
};
