import type { OrderDay, Vendor } from '@/data/types';
import { sortDateKeys } from './dates';

/** date key -> meal id -> quantity */
export type DraftItems = Record<string, Record<string, number>>;

export function mealsOnDate(items: DraftItems, date: string): number {
  const day = items[date];
  if (!day) return 0;
  return Object.values(day).reduce((sum, q) => sum + q, 0);
}

export function totalMeals(items: DraftItems, dates: string[]): number {
  return dates.reduce((sum, d) => sum + mealsOnDate(items, d), 0);
}

export function datesMissingMeals(items: DraftItems, dates: string[]): string[] {
  return dates.filter((d) => mealsOnDate(items, d) === 0);
}

/** Converts the draft into line items grouped by date, dropping empty dates. */
export function buildOrderDays(
  vendor: Vendor,
  dates: string[],
  items: DraftItems,
  notes: Record<string, string>,
): OrderDay[] {
  return sortDateKeys(dates)
    .map((date) => {
      const day = items[date] ?? {};
      const lineItems = vendor.meals
        .filter((m) => (day[m.id] ?? 0) > 0)
        .map((m) => ({
          mealId: m.id,
          mealName: m.name,
          quantity: day[m.id],
          unitPrice: vendor.pricePerMeal,
        }));
      const subtotal = lineItems.reduce((s, li) => s + li.quantity * li.unitPrice, 0);
      return { date, items: lineItems, note: (notes[date] ?? '').trim(), subtotal };
    })
    .filter((d) => d.items.length > 0);
}

export function daysTotal(days: OrderDay[]) {
  return days.reduce((s, d) => s + d.subtotal, 0);
}

export function daysMealCount(days: OrderDay[]) {
  return days.reduce((s, d) => s + d.items.reduce((n, li) => n + li.quantity, 0), 0);
}

export type CreditsCoverage = 'full' | 'partial' | 'none';

export function creditsCoverage(balance: number, total: number): CreditsCoverage {
  if (balance <= 0) return 'none';
  if (balance >= total) return 'full';
  return 'partial';
}

/**
 * Splits a total between meal credits and a direct payment.
 * - full coverage + credits chosen: everything on credits
 * - partial coverage + checkbox ticked: the whole balance, rest paid directly
 * - otherwise: everything paid directly
 */
export function splitPayment(
  total: number,
  balance: number,
  useCredits: boolean,
): { creditsApplied: number; amountDue: number } {
  if (!useCredits || balance <= 0) return { creditsApplied: 0, amountDue: total };
  const creditsApplied = Math.min(balance, total);
  return { creditsApplied, amountDue: round2(total - creditsApplied) };
}

export function round2(n: number) {
  return Math.round(n * 100) / 100;
}
