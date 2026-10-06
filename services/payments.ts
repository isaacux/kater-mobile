import { MOCK_PAYMENT_MS } from '@/constants/config';
import type { MomoNetwork } from '@/data/types';
import { maskPhone } from '@/lib/format';
import { delay, ServiceError } from './mock';

export type DirectPaymentRequest =
  | { kind: 'momo'; amount: number; network: MomoNetwork; phone: string }
  | { kind: 'card'; amount: number; cardNumber: string; expiry: string; cvv: string };

export interface PaymentResult {
  transactionId: string;
  label: string;
}

/** Test values that simulate a declined payment. */
export const DECLINE_MOMO_NUMBER = '0240000000';
export const DECLINE_CARD_NUMBER = '4000000000000002';

/**
 * Mock direct payment (Mobile Money or Visa). Waits a moment, then succeeds,
 * unless a decline test value is used. Swap for a real gateway later.
 */
export async function chargeDirect(req: DirectPaymentRequest): Promise<PaymentResult> {
  await delay(null, MOCK_PAYMENT_MS);
  const txn = `TXN${Date.now().toString().slice(-8)}`;
  if (req.kind === 'momo') {
    const digits = req.phone.replace(/\D/g, '').replace(/^233/, '0');
    if (digits === DECLINE_MOMO_NUMBER) {
      throw new ServiceError('The payment was declined on your phone or timed out. Please try again.');
    }
    return { transactionId: txn, label: `${req.network} Mobile Money · ${maskPhone(req.phone)}` };
  }
  const card = req.cardNumber.replace(/\D/g, '');
  if (card === DECLINE_CARD_NUMBER) {
    throw new ServiceError('Your card was declined. Try another card or pay with Mobile Money.');
  }
  return { transactionId: txn, label: `Visa •••• ${card.slice(-4)}` };
}

/** Mock meal credit redemption. */
export async function redeemCredits(amount: number): Promise<{ transactionId: string }> {
  await delay(null, Math.round(MOCK_PAYMENT_MS * 0.6));
  if (amount <= 0) throw new ServiceError('Nothing to charge.');
  return { transactionId: `CRD${Date.now().toString().slice(-8)}` };
}
