export const TIME_MINUTE_STEP = 5;
export const DEFAULT_START_TIME = '00:00';
export const DEFAULT_END_TIME = '23:55';

export function isValidTimeFormat(value: string): boolean {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
}

export function normalizeTime(value: string, fallback: string): string {
  const target = isValidTimeFormat(value) ? value : fallback;
  const [hour, minute] = target.split(':').map(Number);
  const normalizedMinute = Math.floor(minute / TIME_MINUTE_STEP) * TIME_MINUTE_STEP;
  return `${String(hour).padStart(2, '0')}:${String(normalizedMinute).padStart(2, '0')}`;
}

export function parseDateTimeDot(value: string, fallbackTime: string): { date: Date; time: string } | null {
  const [datePart, timePart] = value.trim().split(/\s+/);
  const [year, month, day] = datePart.split('.').map(Number);

  if (![year, month, day].every(Number.isFinite)) return null;

  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;

  return { date, time: normalizeTime(timePart ?? '', fallbackTime) };
}

export function formatDateTimeDot(date: Date, time: string, fallbackTime: string): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day} ${normalizeTime(time, fallbackTime)}`;
}

export function combineDateTime(date: Date, time: string): Date {
  const [hours, minutes] = normalizeTime(time, DEFAULT_START_TIME).split(':').map(Number);
  const next = new Date(date);
  next.setHours(hours, minutes, 0, 0);
  return next;
}
