export interface StudyTimeSummaryResponse {
  todayStudyTime: number;
  monthlyStudyTime: number;
  totalStudyTime: number;
}

export interface TimerOffRequest {
  totalSeconds: number;
}

export interface TimerOffResponse {
  sessionSeconds: number;
  dailySeconds: number;
  monthlySeconds: number;
  totalSeconds: number;
}
