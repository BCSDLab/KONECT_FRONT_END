type ScheduleTimeParams = {
  startedAt: string;
  endedAt: string;
};

const parseDate = (value: string) => {
  // "2025.12.03 00:00"
  const [date, time] = value.split(' ');
  const [year, month, day] = date.split('.').map(Number);
  const [hour, minute] = time.split(':').map(Number);

  return new Date(year, month - 1, day, hour, minute);
};

export const formatScheduleTime = ({ startedAt, endedAt }: ScheduleTimeParams): string => {
  const start = parseDate(startedAt);
  const end = parseDate(endedAt);

  const startDateStr = startedAt.split(' ')[0];
  const endDateStr = endedAt.split(' ')[0];

  const startTime = startedAt.split(' ')[1];
  const endTime = endedAt.split(' ')[1];

  // 1️⃣ 같은 날짜
  if (startDateStr === endDateStr) {
    if (startTime === '00:00' && endTime === '00:00') {
      return '하루 동안 진행 예정';
    }

    return `${startTime} ~ ${endTime}`;
  }

  // 2️⃣ 여러 날짜 (며칠간 진행)
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  return `${diffDays}일 동안 진행 예정`;
};
