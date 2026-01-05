import { apiClient } from '../client';
import type { TimerOffResponse, StudyTimeSummaryResponse } from './entity';

export const getStudyTimeSummary = async () => {
  console.log('[API] getStudyTimeSummary called');
  const response = await apiClient.get<StudyTimeSummaryResponse>('studytimes/summary');
  return response;
};

export const StartStudyTimer = async () => {
  const response = await apiClient.post('studytimes/timers');
  return response;
};

export const StopStudyTimer = async (data: { totalSeconds: number }) => {
  const response = await apiClient.delete<TimerOffResponse>('studytimes/timers', { body: data });
  return response;
};
