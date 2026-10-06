import { findHub, normaliseHubCode } from '@/data/hubs';
import type { Hub } from '@/data/types';
import { delay, ServiceError } from './mock';

/**
 * Looks up a hub by its code. Mocked against local seed data;
 * swap for an API call later.
 */
export async function lookupHub(code: string): Promise<Hub> {
  const normalised = normaliseHubCode(code);
  if (!normalised) throw new ServiceError('Enter your hub code.');
  const hub = await delay(findHub(normalised));
  if (!hub) {
    throw new ServiceError(
      `We couldn't find a hub with the code "${normalised}". Check the code with your office admin and try again.`,
    );
  }
  return hub;
}
