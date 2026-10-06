import { findOrganisation, normaliseKaterId } from '@/data/users';
import type { Organisation } from '@/data/types';
import { delay, ServiceError } from './mock';

export async function lookupOrganisation(katerId: string): Promise<Organisation> {
  const id = normaliseKaterId(katerId);
  if (!id) throw new ServiceError('Enter the organisation Kater ID.');
  const org = await delay(findOrganisation(id));
  if (!org) {
    throw new ServiceError(`No organisation found for "${id}". Ask your HR or office admin for your org Kater ID.`);
  }
  return org;
}
