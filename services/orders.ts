import type { ContactDetails, DeliveryLocation, Hub, Order, OrderDay, PaymentBreakdown, Vendor } from '@/data/types';
import { generateId, generateReference } from '@/lib/format';

/**
 * Mock order submission: builds the confirmed order locally.
 * Swap for a POST to the orders API later.
 */
export function createOrder(input: {
  hub: Hub;
  vendor: Vendor;
  location: DeliveryLocation;
  days: OrderDay[];
  payment: PaymentBreakdown;
  customer: ContactDetails;
  mode: Order['mode'];
}): Order {
  return {
    id: generateId('ord'),
    reference: generateReference(),
    hubCode: input.hub.code,
    companyName: input.hub.companyName,
    vendorId: input.vendor.id,
    vendorName: input.vendor.name,
    deliveryWindow: input.vendor.deliveryWindow,
    location: input.location,
    days: input.days,
    total: input.payment.total,
    payment: input.payment,
    status: 'upcoming',
    placedAt: new Date().toISOString(),
    customer: input.customer,
    mode: input.mode,
  };
}
