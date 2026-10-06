import type { Organisation, User } from './types';

/** Directory of organisations a user can join with an org Kater ID. */
export const ORGANISATIONS: Organisation[] = [
  { katerId: 'KTR-TOT-1024', employerName: 'Totality Energy Ghana' },
  { katerId: 'KTR-OMA-2026', employerName: 'Omanye Capital' },
  { katerId: 'KTR-KAS-3310', employerName: 'Kasoa Logistics Ltd' },
  { katerId: 'KTR-ACC-0077', employerName: 'Accra Tech Hub' },
];

export function normaliseKaterId(input: string) {
  return input.replace(/\s+/g, '').toUpperCase();
}

export function findOrganisation(katerId: string): Organisation | undefined {
  const id = normaliseKaterId(katerId);
  return ORGANISATIONS.find((o) => o.katerId === id);
}

/** Demo account with employer-funded meal credits. */
export const DEMO_USER: User = {
  id: 'user_ama',
  name: 'Ama Mensah',
  phone: '024 123 4567',
  email: 'ama.mensah@example.com',
  organisations: [ORGANISATIONS[0]],
  mealCreditBalance: 240,
  creditFunder: 'Totality Energy Ghana',
  creditInstructions: 'GHS 60 per day, Monday to Friday. Unused credits reset monthly.',
};

/** Demo account with no employer and no credits, to show empty states. */
export const NO_CREDITS_USER: User = {
  id: 'user_kwame',
  name: 'Kwame Boateng',
  phone: '020 111 2222',
  email: 'kwame@example.com',
  organisations: [],
  mealCreditBalance: 0,
  creditFunder: null,
  creditInstructions: null,
};

export const SEED_USERS: User[] = [DEMO_USER, NO_CREDITS_USER];
