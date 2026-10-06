import { DEMO_USER, SEED_USERS } from '@/data/users';
import type { ContactDetails, User } from '@/data/types';
import { formatGhanaPhone, generateId } from '@/lib/format';
import { isValidEmail, isValidGhanaPhone, looksLikeEmail } from '@/lib/validation';
import { delay, ServiceError } from './mock';

const digits = (s: string) => s.replace(/\D/g, '').replace(/^233/, '0');

function matchSeedUser(identifier: string): User | undefined {
  const id = identifier.trim().toLowerCase();
  return SEED_USERS.find(
    (u) => u.email.toLowerCase() === id || (digits(u.phone) === digits(id) && digits(id).length >= 10),
  );
}

export function validateIdentifier(identifier: string): string | null {
  const value = identifier.trim();
  if (!value) return 'Enter your phone number or email.';
  if (looksLikeEmail(value)) return isValidEmail(value) ? null : 'Enter a valid email address.';
  return isValidGhanaPhone(value) ? null : 'Enter a Ghana number (e.g. 024 123 4567) or an email.';
}

/** Mock: pretends to send a one-time code by SMS or email. */
export async function requestCode(identifier: string): Promise<{ sentTo: string }> {
  const error = validateIdentifier(identifier);
  if (error) throw new ServiceError(error);
  const sentTo = looksLikeEmail(identifier) ? identifier.trim() : formatGhanaPhone(identifier);
  return delay({ sentTo });
}

/**
 * Mock: accepts any 6-digit code. Known demo identifiers return their seeded
 * account; anything else signs in as the demo user with that identifier.
 */
export async function verifyCode(identifier: string, code: string): Promise<User> {
  if (!/^\d{6}$/.test(code)) throw new ServiceError('Enter the 6-digit code.');
  const seeded = matchSeedUser(identifier);
  if (seeded) return delay(seeded);
  const isEmail = looksLikeEmail(identifier);
  return delay({
    ...DEMO_USER,
    email: isEmail ? identifier.trim() : DEMO_USER.email,
    phone: isEmail ? DEMO_USER.phone : formatGhanaPhone(identifier),
  });
}

/** Mock: creates a brand-new account (no employer, no credits). */
export function buildNewUser(details: ContactDetails): User {
  return {
    id: generateId('user'),
    name: details.name.trim(),
    phone: formatGhanaPhone(details.phone),
    email: details.email.trim(),
    organisations: [],
    mealCreditBalance: 0,
    creditFunder: null,
    creditInstructions: null,
  };
}
