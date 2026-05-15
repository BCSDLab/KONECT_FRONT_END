import type { PaginationParams, PaginationResponse } from '../common/pagination';

export interface StudyTimeSummaryResponse {
  todayStudyTime: number;
  monthlyStudyTime: number;
  totalStudyTime: number;
}

export interface StopTimerRequest {
  totalSeconds: number;
}

export interface StopTimerResponse {
  sessionSeconds: number;
  dailySeconds: number;
  monthlySeconds: number;
  totalSeconds: number;
}

export interface StudyRankingParams extends PaginationParams {
  type: 'CLUB' | 'STUDENT_NUMBER' | 'PERSONAL';
  sort: 'MONTHLY' | 'DAILY';
}

export interface StudyRanking {
  rank: number;
  name: string;
  monthlyStudyTime: number;
  dailyStudyTime: number;
}

export interface StudyRankingResponse extends PaginationResponse {
  rankings: StudyRanking[];
}

export interface MyStudyRankingParams {
  sort: 'MONTHLY' | 'DAILY';
}

export interface MyStudyRankingResponse {
  clubRankings: StudyRanking[];
  studentNumberRanking: StudyRanking | null;
  personalRanking: StudyRanking | null;
}
