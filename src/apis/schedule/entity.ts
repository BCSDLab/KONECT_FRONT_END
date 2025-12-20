export interface Schedule {
  title: string;
  startedAt: string;
  endedAt: string;
  dDay: number;
}

export interface ScheduleListResponse {
  schedules: Schedule[];
}
