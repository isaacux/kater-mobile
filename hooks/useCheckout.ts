import { router } from 'expo-router';
import { useCallback, useMemo } from 'react';

import type { PaymentBreakdown } from '@/data/types';
import { buildOrderDays, creditsCoverage, daysMealCount, daysTotal, splitPayment } from '@/lib/order';
import { createOrder } from '@/services/orders';
import { useAppStore, useCurrentUser } from '@/store/app';
import { useDraftContext, useDraftStore } from '@/store/draft';

/**
 * Everything the review and payment steps need: the order grouped by date,
 * totals, and how the total splits between meal credits and a direct payment.
 */
export function useCheckout() {
  const { hub, vendor, location } = useDraftContext();
  const dates = useDraftStore((s) => s.dates);
  const items = useDraftStore((s) => s.items);
  const notes = useDraftStore((s) => s.notes);
  const useCreditsChoice = useDraftStore((s) => s.useCredits);
  const user = useCurrentUser();

  const days = useMemo(
    () => (vendor ? buildOrderDays(vendor, dates, items, notes) : []),
    [vendor, dates, items, notes],
  );
  const total = daysTotal(days);
  const mealCount = daysMealCount(days);
  const balance = user?.mealCreditBalance ?? 0;
  const coverage = creditsCoverage(balance, total);
  const useCredits = !!user && coverage !== 'none' && useCreditsChoice;
  const { creditsApplied, amountDue } = splitPayment(total, balance, useCredits);

  return {
    hub,
    vendor,
    location,
    days,
    total,
    mealCount,
    user,
    signedIn: !!user,
    balance,
    coverage,
    useCredits,
    creditsApplied,
    amountDue,
  };
}

/** Finalises the order after (mock) payment and opens the success screen. */
export function usePlaceOrder() {
  const checkout = useCheckout();
  const recordOrder = useAppStore((s) => s.recordOrder);
  const saveGuestDetails = useAppStore((s) => s.saveGuestDetails);
  const completeOrder = useDraftStore((s) => s.completeOrder);
  const contact = useDraftStore((s) => s.contact);

  return useCallback(
    (direct: { method: 'momo' | 'card'; label: string } | null) => {
      const { hub, vendor, location, days, total, creditsApplied, amountDue, user } = checkout;
      if (!hub || !vendor || !location) return;
      const customer = user ? { name: user.name, phone: user.phone, email: user.email } : contact;
      if (!customer) return;

      const payment: PaymentBreakdown = {
        total,
        creditsApplied,
        amountPaid: amountDue,
        directMethod: direct?.method ?? null,
        directMethodLabel: direct?.label ?? null,
      };
      const order = createOrder({ hub, vendor, location, days, payment, customer, mode: user ? 'signed-in' : 'guest' });
      recordOrder(order);
      if (!user) saveGuestDetails(customer);
      completeOrder(order);
      router.push('/order/success');
    },
    [checkout, contact, recordOrder, saveGuestDetails, completeOrder],
  );
}
