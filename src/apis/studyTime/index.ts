import { apiClient } from '../client';
import type { TimerOffResponse, StudyTimeSummaryResponse } from './entity';

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
  const response = await apiClient.delete<TimerOffResponse>('studytimes/timers', { requiresAuth: true, body: data });
  return response;
};
