export interface Schedule {
  title: string;
  startedAt: string;
  endedAt: string;
  dDay: number;
  scheduleCategory: 'UNIVERSITY' | 'CLUB' | 'COUNCIL' | 'DORM';
}

export interface ScheduleListResponse {
  schedules: Schedule[];
}

export interface ScheduleRequestParams {
  year: number;
  month: number;
}
