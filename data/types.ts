export type DietaryTag =
  | 'Vegetarian'
  | 'Vegan'
  | 'Spicy'
  | 'Gluten-free'
  | 'Contains nuts'
  | 'Seafood'
  | 'High protein';

export interface Meal {
  id: string;
  name: string;
  description: string;
  image: string;
  tags: DietaryTag[];
}

export interface Vendor {
  id: string;
  name: string;
  image: string;
  cuisine: string;
  /** One price for every dish this vendor offers, in GHS. */
  pricePerMeal: number;
  /** e.g. "11:30am to 12:00pm" */
  deliveryWindow: string;
  meals: Meal[];
}

export interface DeliveryLocation {
  id: string;
  /** e.g. "3rd Floor" or "Airport City Branch" */
  label: string;
  detail?: string;
}

export interface Hub {
  code: string;
  companyName: string;
  deliveryLocations: DeliveryLocation[];
  vendors: Vendor[];
}

export interface Organisation {
  /** Org Kater ID, e.g. "KTR-TOT-1024" */
  katerId: string;
  employerName: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  organisations: Organisation[];
  /** Meal credit balance in GHS. */
  mealCreditBalance: number;
  /** Employer funding the credits, if any. */
  creditFunder: string | null;
  /** Instructions from the employer about how credits work. */
  creditInstructions: string | null;
}

export type OrderStatus = 'upcoming' | 'delivered' | 'cancelled';

export interface OrderLineItem {
  mealId: string;
  mealName: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderDay {
  /** Local date key, YYYY-MM-DD */
  date: string;
  items: OrderLineItem[];
  note: string;
  subtotal: number;
}

export type PaymentMethod = 'credits' | 'momo' | 'card';

export type MomoNetwork = 'MTN' | 'Telecel' | 'AirtelTigo';

export interface PaymentBreakdown {
  total: number;
  creditsApplied: number;
  amountPaid: number;
  /** How the non-credit portion was paid, if any. */
  directMethod: Exclude<PaymentMethod, 'credits'> | null;
  /** e.g. "MTN Mobile Money · 024 *** 4567" or "Visa •••• 4242" */
  directMethodLabel: string | null;
}

export interface ContactDetails {
  name: string;
  phone: string;
  email: string;
}

export interface Order {
  id: string;
  reference: string;
  hubCode: string;
  companyName: string;
  vendorId: string;
  vendorName: string;
  deliveryWindow: string;
  location: DeliveryLocation;
  /** Line items grouped by date, sorted ascending. */
  days: OrderDay[];
  total: number;
  payment: PaymentBreakdown;
  status: OrderStatus;
  /** ISO timestamp */
  placedAt: string;
  customer: ContactDetails;
  mode: 'guest' | 'signed-in';
}

export interface CreditActivity {
  id: string;
  /** ISO timestamp */
  date: string;
  /** Positive for top-ups, negative for spend. */
  amount: number;
  /** e.g. vendor name or "Monthly allowance" */
  description: string;
  /** e.g. "Order KTR-7Q4M2A" */
  detail?: string;
  orderId?: string;
}
