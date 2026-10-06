import { addDays, getWorkingWeeks, toDateKey } from '@/lib/dates';
import { generateId } from '@/lib/format';
import { buildOrderDays, daysTotal } from '@/lib/order';
import { HUBS } from './hubs';
import type { CreditActivity, Order, OrderStatus, PaymentBreakdown, User } from './types';

/**
 * Order history for the demo account, generated relative to today so the
 * prototype always has upcoming, delivered and cancelled orders to show.
 */
export function seedHistoryFor(user: User, now: Date = new Date()): {
  orders: Order[];
  activity: CreditActivity[];
} {
  if (user.id !== 'user_ama') return { orders: [], activity: [] };

  const hub = HUBS[0];
  const [auntie, grill, green] = hub.vendors;
  const [reception, third, fifth] = hub.deliveryLocations;

  const thisMonday = (() => {
    const d = new Date(now);
    d.setHours(0, 0, 0, 0);
    const dow = d.getDay();
    return addDays(d, dow === 0 ? -6 : 1 - dow);
  })();
  const weekKeys = (weeksAgo: number, count = 5) =>
    Array.from({ length: count }, (_, i) => toDateKey(addDays(thisMonday, -7 * weeksAgo + i)));

  const upcomingDates = getWorkingWeeks(now, 2)
    .flat()
    .filter((d) => d.orderable)
    .slice(0, 2)
    .map((d) => d.key);

  const customer = { name: user.name, phone: user.phone, email: user.email };

  type Pick = [mealIndex: number, quantity: number];
  type PaySpec = {
    credits: number | 'all';
    direct?: { method: 'momo' | 'card'; label: string };
  };

  function make(
    ref: string,
    vendor: typeof auntie,
    location: typeof reception,
    dates: string[],
    picksPerDay: Pick[][],
    status: OrderStatus,
    pay: PaySpec,
    placedDaysBefore: number,
    notes: Record<string, string> = {},
  ): Order {
    const items: Record<string, Record<string, number>> = {};
    dates.forEach((date, i) => {
      items[date] = {};
      for (const [mealIndex, qty] of picksPerDay[i % picksPerDay.length]) {
        items[date][vendor.meals[mealIndex].id] = qty;
      }
    });
    const days = buildOrderDays(vendor, dates, items, notes);
    const total = daysTotal(days);
    const creditsApplied = pay.credits === 'all' ? total : Math.min(pay.credits, total);
    const payment: PaymentBreakdown = {
      total,
      creditsApplied,
      amountPaid: total - creditsApplied,
      directMethod: pay.direct?.method ?? null,
      directMethodLabel: pay.direct?.label ?? null,
    };
    const placedAt = addDays(new Date(`${dates[0]}T10:00:00`), -placedDaysBefore);
    return {
      id: `ord_${ref}`,
      reference: ref,
      hubCode: hub.code,
      companyName: hub.companyName,
      vendorId: vendor.id,
      vendorName: vendor.name,
      deliveryWindow: vendor.deliveryWindow,
      location,
      days,
      total,
      payment,
      status,
      placedAt: placedAt.toISOString(),
      customer,
      mode: 'signed-in',
    };
  }

  const upcoming = make(
    'KTR-7Q4M2A',
    auntie,
    third,
    upcomingDates,
    [[[0, 1]], [[1, 1]]],
    'upcoming',
    { credits: 'all' },
    2,
    { [upcomingDates[0]]: 'Extra shito please' },
  );

  const lastWeek = weekKeys(1);
  const delivered1 = make(
    'KTR-3HXP8K',
    green,
    fifth,
    lastWeek,
    [[[0, 1]], [[2, 1], [4, 1]], [[5, 1]]],
    'delivered',
    { credits: 280, direct: { method: 'momo', label: 'MTN Mobile Money · 024 *** 4567' } },
    3,
    { [lastWeek[1]]: 'One for Kojo (Finance), one for me' },
  );

  const twoWeeks = weekKeys(2, 3);
  const cancelled = make(
    'KTR-9WD2RN',
    grill,
    reception,
    twoWeeks,
    [[[1, 1]]],
    'cancelled',
    { credits: 0, direct: { method: 'card', label: 'Visa •••• 4242 (refunded)' } },
    2,
  );

  const threeWeeks = weekKeys(3, 2);
  const delivered2 = make(
    'KTR-5LBT6C',
    auntie,
    third,
    threeWeeks,
    [[[0, 2], [3, 1]], [[4, 1]]],
    'delivered',
    { credits: 'all' },
    4,
    { [threeWeeks[0]]: 'Jollof x2: Ama and Efua (HR)' },
  );

  const orders = [upcoming, delivered1, cancelled, delivered2];

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1, 6, 0, 0);
  const activity: CreditActivity[] = [
    {
      id: generateId('act'),
      date: upcoming.placedAt,
      amount: -upcoming.payment.creditsApplied,
      description: upcoming.vendorName,
      detail: `Order ${upcoming.reference}`,
      orderId: upcoming.id,
    },
    {
      id: generateId('act'),
      date: monthStart.toISOString(),
      amount: user.mealCreditBalance + upcoming.payment.creditsApplied,
      description: 'Monthly allowance',
      detail: `From ${user.creditFunder}`,
    },
    {
      id: generateId('act'),
      date: delivered1.placedAt,
      amount: -delivered1.payment.creditsApplied,
      description: delivered1.vendorName,
      detail: `Order ${delivered1.reference}`,
      orderId: delivered1.id,
    },
    {
      id: generateId('act'),
      date: delivered2.placedAt,
      amount: -delivered2.payment.creditsApplied,
      description: delivered2.vendorName,
      detail: `Order ${delivered2.reference}`,
      orderId: delivered2.id,
    },
  ].sort((a, b) => b.date.localeCompare(a.date));

  return { orders, activity };
}
