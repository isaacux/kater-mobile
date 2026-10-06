/**
 * Ghana mobile numbers: 10 digits starting with 0 (e.g. 024 123 4567),
 * or the international form +233 / 233 followed by 9 digits.
 */
export function isValidGhanaPhone(input: string): boolean {
  const compact = input.replace(/[\s\-()]/g, '');
  return /^(?:\+?233|0)[235]\d{8}$/.test(compact);
}

export function isValidEmail(input: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.trim());
}

export function looksLikeEmail(input: string) {
  return input.includes('@');
}

export function validateName(name: string): string | null {
  if (name.trim().length < 2) return 'Enter your full name.';
  return null;
}

export function validatePhone(phone: string): string | null {
  if (!phone.trim()) return 'Enter your phone number.';
  if (!isValidGhanaPhone(phone)) return 'Enter a Ghana number, e.g. 024 123 4567 or +233 24 123 4567.';
  return null;
}

export function validateEmail(email: string): string | null {
  if (!email.trim()) return 'Enter your email address.';
  if (!isValidEmail(email)) return 'Enter a valid email, e.g. ama@company.com.';
  return null;
}

/** Card number Luhn check, used by the mock card form. */
export function isValidCardNumber(input: string): boolean {
  const digits = input.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = Number(digits[i]);
    if (double) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    double = !double;
  }
  return sum % 10 === 0;
}

export function isValidExpiry(input: string, now: Date = new Date()): boolean {
  const m = input.match(/^(\d{2})\s*\/\s*(\d{2})$/);
  if (!m) return false;
  const month = Number(m[1]);
  const year = 2000 + Number(m[2]);
  if (month < 1 || month > 12) return false;
  const endOfMonth = new Date(year, month, 0, 23, 59, 59);
  return endOfMonth.getTime() >= now.getTime();
}
