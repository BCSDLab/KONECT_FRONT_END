export const formatIsoDateToYYYYMMDD = (value: string): string => {
  if (!value) return '';

  const [datePart] = value.split('T');
  const [year, month, day] = datePart.split('-');

  if (!year || !month || !day) return value;

  return `${year}.${month.padStart(2, '0')}.${day.padStart(2, '0')}`;
};
