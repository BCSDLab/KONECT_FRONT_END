export const formatIsoDateToYYYYMMDDHHMM = (value: string): string => {
  if (!value) return '';

  const [datePart, timePart] = value.split('T');
  const [year, month, day] = datePart.split('-');

  if (!year || !month || !day) return value;

  const date = `${year}.${month.padStart(2, '0')}.${day.padStart(2, '0')}`;
  if (!timePart) return date;

  const [hour, minute] = timePart.split(':');
  return `${date} ${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
};

export const formatIsoDateToYYYYMMDD = (value: string): string => {
  if (!value) return '';

  const [datePart] = value.split('T');
  const [year, month, day] = datePart.split('-');

  if (!year || !month || !day) return value;

  return `${year}.${month.padStart(2, '0')}.${day.padStart(2, '0')}`;
};
