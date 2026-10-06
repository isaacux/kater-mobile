/** Always "GHS 55.00" */
export function formatGHS(amount: number): string {
  const fixed = (Math.round(amount * 100) / 100).toFixed(2);
  const [whole, frac] = fixed.split('.');
  const withCommas = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `GHS ${withCommas}.${frac}`;
}

export function pluralise(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}

/** Formats a Ghana phone number for display: "024 123 4567". */
export function formatGhanaPhone(input: string): string {
  const digits = input.replace(/\D/g, '');
  let local = digits;
  if (digits.startsWith('233') && digits.length === 12) local = `0${digits.slice(3)}`;
  if (local.length !== 10) return input.trim();
  return `${local.slice(0, 3)} ${local.slice(3, 6)} ${local.slice(6)}`;
}

/** "024 *** 4567" */
export function maskPhone(input: string): string {
  const formatted = formatGhanaPhone(input);
  const parts = formatted.split(' ');
  if (parts.length !== 3) return formatted;
  return `${parts[0]} *** ${parts[2]}`;
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
}

export function generateReference(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let ref = '';
  for (let i = 0; i < 6; i++) ref += chars[Math.floor(Math.random() * chars.length)];
  return `KTR-${ref}`;
}

export function generateId(prefix = 'id'): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}
