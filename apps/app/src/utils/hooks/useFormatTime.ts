type ScheduleTimeParams = {
  startedAt: string;
  endedAt: string;
};

const formatMMDD = (value: string) => {
  const [date] = value.split(' ');
  const [, month, day] = date.split('.').map(Number);
  return `${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')}`;
};

export const formatScheduleTime = ({ startedAt, endedAt }: ScheduleTimeParams): string => {
  const startDateStr = startedAt.split(' ')[0];
  const endDateStr = endedAt.split(' ')[0];

  const startTime = startedAt.split(' ')[1];
  const endTime = endedAt.split(' ')[1];

  if (startDateStr === endDateStr) {
    if (startTime === '00:00' && endTime === '00:00') {
      return '';
    }

    return `${startTime} ~ ${endTime}`;
  }

  const startMMDD = formatMMDD(startedAt);
  const endMMDD = formatMMDD(endedAt);

  return `${startMMDD}~${endMMDD}`;
};
