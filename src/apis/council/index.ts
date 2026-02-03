import { apiClient } from '../client';
import type { CouncilNoticeDetail, CouncilResponse, NoticeRequestParams, NoticeResponse } from './entity';

export const getCouncilNotice = async (params: NoticeRequestParams) => {
  const response = await apiClient.get<NoticeResponse, NoticeRequestParams>('councils/notices', {
    params,
    requiresAuth: true,
  });
  return response;
};

export const getCouncilInfo = async () => {
  const response = await apiClient.get<CouncilResponse>('councils', { requiresAuth: true });
  return response;
};

export const getCouncilNoticeDetail = async (noticeId: number) => {
  const response = await apiClient.get<CouncilNoticeDetail>(`councils/notices/${noticeId}`, { requiresAuth: true });
  return response;
};
