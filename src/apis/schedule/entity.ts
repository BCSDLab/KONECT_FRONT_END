export interface Schedule {
  title: string;
  startedAt: string;
  endedAt: string;
  dDay: number;
  scheduleCategory: 'UNIVERSITY' | 'CLUB' | 'COUNCIL';
}

export interface ScheduleListResponse {
  schedules: Schedule[];
}

export interface ScheduleRequestParams {
  year: number;
  month: number;
}
