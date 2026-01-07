import { apiClient } from '../client';
import type {
  MyStudyRankingResponse,
  StopTimerResponse,
  StudyRankingParams,
  StudyRankingResponse,
  StudyTimeSummaryResponse,
} from './entity';

export const getStudyTimeSummary = async () => {
  const response = await apiClient.get<StudyTimeSummaryResponse>('studytimes/summary', {
    requiresAuth: true,
  });
  return response;
};

export const startStudyTimer = async () => {
  const response = await apiClient.post('studytimes/timers', {
    requiresAuth: true,
  });
  return response;
};

export const stopStudyTimer = async (data: { totalSeconds: number }) => {
  const response = await apiClient.delete<StopTimerResponse>('studytimes/timers', { requiresAuth: true, body: data });
  return response;
};

export const getStudyTimeRanking = async (params: StudyRankingParams) => {
  const response = await apiClient.get<StudyRankingResponse, StudyRankingParams>('studytimes/rankings', {
    params,
    requiresAuth: true,
  });
  return response;
};

export const getMyStudyTimeRanking = async () => {
  const response = await apiClient.get<MyStudyRankingResponse>('studytimes/rankings/me', {
    requiresAuth: true,
  });
  return response;
};
