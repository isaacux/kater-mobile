import { ORDER_CUTOFF_HOUR, ORDER_CUTOFF_LABEL, ORDERING_WEEKS_AHEAD } from '@/constants/config';

const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Local date key in YYYY-MM-DD form. */
export function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Parses a YYYY-MM-DD key as local midnight. */
export function fromDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(d: Date, days: number): Date {
  const next = new Date(d);
  next.setDate(next.getDate() + days);
  return next;
}

export function isWeekday(d: Date) {
  const day = d.getDay();
  return day !== 0 && day !== 6;
}

/** The moment ordering closes for a delivery date: the day before, at the cutoff hour. */
export function getCutoff(dateKey: string): Date {
  const cutoff = addDays(fromDateKey(dateKey), -1);
  cutoff.setHours(ORDER_CUTOFF_HOUR, 0, 0, 0);
  return cutoff;
}

export function isOrderable(dateKey: string, now: Date = new Date()): boolean {
  return now.getTime() < getCutoff(dateKey).getTime();
}

export const CUTOFF_EXPLANATION = `Orders close at ${ORDER_CUTOFF_LABEL} the day before delivery.`;

export interface CalendarDay {
  key: string;
  date: Date;
  orderable: boolean;
  isToday: boolean;
}

/**
 * Working days (Mon to Fri) for this week and the next few weeks,
 * grouped by week. Dates past the cutoff are included but marked
 * not orderable so the UI can explain why.
 */
export function getWorkingWeeks(now: Date = new Date(), weeks = ORDERING_WEEKS_AHEAD): CalendarDay[][] {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  // Start from Monday of the current week. On weekends, start from next Monday.
  const dow = today.getDay();
  const offsetToMonday = dow === 0 ? 1 : dow === 6 ? 2 : 1 - dow;
  const firstMonday = addDays(today, offsetToMonday);
  const todayKey = toDateKey(today);

  const result: CalendarDay[][] = [];
  for (let w = 0; w < weeks; w++) {
    const week: CalendarDay[] = [];
    for (let d = 0; d < 5; d++) {
      const date = addDays(firstMonday, w * 7 + d);
      const key = toDateKey(date);
      week.push({ key, date, orderable: isOrderable(key, now), isToday: key === todayKey });
    }
    result.push(week);
  }
  return result;
}

/** "Mon 12 Oct" */
export function formatShortDate(key: string): string {
  const d = fromDateKey(key);
  return `${DAY_SHORT[d.getDay()]} ${d.getDate()} ${MONTH_SHORT[d.getMonth()]}`;
}

/** "Monday 12 October" style, with short month for compactness: "Monday, 12 Oct" */
export function formatLongDate(key: string): string {
  const d = fromDateKey(key);
  return `${DAY_LONG[d.getDay()]}, ${d.getDate()} ${MONTH_SHORT[d.getMonth()]}`;
}

export function formatDayName(d: Date) {
  return DAY_SHORT[d.getDay()];
}

export function formatMonth(d: Date) {
  return MONTH_SHORT[d.getMonth()];
}

/** "Mon 12 Oct" or "Mon 12 Oct to Fri 16 Oct" */
export function formatDateRange(keys: string[]): string {
  if (keys.length === 0) return '';
  const sorted = [...keys].sort();
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  if (first === last) return formatShortDate(first);
  return `${formatShortDate(first)} to ${formatShortDate(last)}`;
}

/** "6 Oct 2026, 2:15pm" */
export function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  let h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, '0');
  const ampm = h >= 12 ? 'pm' : 'am';
  h = h % 12 || 12;
  return `${d.getDate()} ${MONTH_SHORT[d.getMonth()]} ${d.getFullYear()}, ${h}:${m}${ampm}`;
}

export function sortDateKeys(keys: string[]) {
  return [...keys].sort();
}
