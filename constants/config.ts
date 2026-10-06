/**
 * App-wide configuration. Change values here, not in screens.
 */

/** Orders for a date close at this hour (24h, local time) on the day before. */
export const ORDER_CUTOFF_HOUR = 18;

/** Human label for the cutoff, used in explanations. */
export const ORDER_CUTOFF_LABEL = '6:00pm';

/** How many weeks of working days (Mon to Fri) to show on the dates step. */
export const ORDERING_WEEKS_AHEAD = 3;

/** Max quantity of a single meal per date. */
export const MAX_MEAL_QUANTITY = 50;

/** Simulated network latency for mock services, in ms. */
export const MOCK_LATENCY_MS = 700;

/** Simulated payment processing time, in ms. */
export const MOCK_PAYMENT_MS = 2200;

