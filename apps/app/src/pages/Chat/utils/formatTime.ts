export const formatTime = (timeString: string) => {
  const timeMatch = timeString.match(/(\d{1,2}):(\d{2})/);

  if (!timeMatch) {
    return '';
  }

  const hour = Number(timeMatch[1]);
  const minute = Number(timeMatch[2]);
  const period = hour < 12 ? '오전' : '오후';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;

  return `${period} ${displayHour}:${String(minute).padStart(2, '0')}`;
};
