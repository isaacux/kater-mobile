import { create } from 'zustand';

import { MAX_MEAL_QUANTITY } from '@/constants/config';
import { findHub, findVendor } from '@/data/hubs';
import type { ContactDetails, Order } from '@/data/types';
import { isOrderable, sortDateKeys } from '@/lib/dates';
import type { DraftItems } from '@/lib/order';

/**
 * The order being built. Lives in memory only, so going back through the
 * steps keeps every selection.
 */
interface DraftState {
  hubCode: string | null;
  vendorId: string | null;
  locationId: string | null;
  dates: string[];
  items: DraftItems;
  notes: Record<string, string>;
  activeDate: string | null;
  /** Payment choice for signed-in users. */
  useCredits: boolean;
  /** Guest contact details entered on the review step. */
  contact: ContactDetails | null;
  /** Most recently placed order, shown on the success screen. */
  lastOrder: Order | null;

  /** Opens a vendor. Keeps the draft if it is the same vendor, otherwise starts fresh. */
  startVendor: (hubCode: string, vendorId: string) => void;
  setLocation: (id: string) => void;
  toggleDate: (date: string) => void;
  clearDates: () => void;
  /** Drops dates that have passed the cutoff since they were picked. */
  pruneExpiredDates: () => void;
  setActiveDate: (date: string) => void;
  setQuantity: (date: string, mealId: string, quantity: number) => void;
  /** Copies one date's meals to every other selected date. */
  copyToAllDates: (fromDate: string) => void;
  setNote: (date: string, note: string) => void;
  setUseCredits: (value: boolean) => void;
  setContact: (contact: ContactDetails) => void;
  completeOrder: (order: Order) => void;
  reset: () => void;
}

const empty = {
  hubCode: null,
  vendorId: null,
  locationId: null,
  dates: [],
  items: {},
  notes: {},
  activeDate: null,
  useCredits: true,
  contact: null,
};

export const useDraftStore = create<DraftState>()((set, get) => ({
  ...empty,
  lastOrder: null,

  startVendor: (hubCode, vendorId) => {
    const s = get();
    if (s.hubCode === hubCode && s.vendorId === vendorId) return;
    set({
      ...empty,
      hubCode,
      vendorId,
      // Location belongs to the hub, so keep it when switching vendor in the same hub.
      locationId: s.hubCode === hubCode ? s.locationId : null,
    });
  },

  setLocation: (id) => set({ locationId: id }),

  toggleDate: (date) =>
    set((s) => {
      const dates = s.dates.includes(date)
        ? s.dates.filter((d) => d !== date)
        : sortDateKeys([...s.dates, date]);
      const activeDate = s.activeDate && dates.includes(s.activeDate) ? s.activeDate : dates[0] ?? null;
      return { dates, activeDate };
    }),

  clearDates: () => set({ dates: [], activeDate: null }),

  pruneExpiredDates: () =>
    set((s) => {
      const dates = s.dates.filter((d) => isOrderable(d));
      if (dates.length === s.dates.length) return s;
      const activeDate = s.activeDate && dates.includes(s.activeDate) ? s.activeDate : dates[0] ?? null;
      return { dates, activeDate };
    }),

  setActiveDate: (date) => set({ activeDate: date }),

  setQuantity: (date, mealId, quantity) =>
    set((s) => {
      const q = Math.max(0, Math.min(MAX_MEAL_QUANTITY, Math.floor(quantity || 0)));
      const day = { ...(s.items[date] ?? {}) };
      if (q === 0) delete day[mealId];
      else day[mealId] = q;
      return { items: { ...s.items, [date]: day } };
    }),

  copyToAllDates: (fromDate) =>
    set((s) => {
      const source = s.items[fromDate] ?? {};
      const items = { ...s.items };
      for (const d of s.dates) items[d] = { ...source };
      return { items };
    }),

  setNote: (date, note) => set((s) => ({ notes: { ...s.notes, [date]: note } })),

  setUseCredits: (value) => set({ useCredits: value }),

  setContact: (contact) => set({ contact }),

  completeOrder: (order) => set({ ...empty, hubCode: get().hubCode, locationId: get().locationId, lastOrder: order }),

  reset: () => set({ ...empty }),
}));

/** Resolves the draft's ids into hub, vendor and location objects. */
export function useDraftContext() {
  const hubCode = useDraftStore((s) => s.hubCode);
  const vendorId = useDraftStore((s) => s.vendorId);
  const locationId = useDraftStore((s) => s.locationId);
  const hub = hubCode ? findHub(hubCode) : undefined;
  const vendor = hub && vendorId ? findVendor(hub, vendorId) : undefined;
  const location = hub?.deliveryLocations.find((l) => l.id === locationId);
  return { hub, vendor, location };
}
