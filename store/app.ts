import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { seedHistoryFor } from '@/data/seed';
import type { ContactDetails, CreditActivity, Order, Organisation, User } from '@/data/types';
import { generateId } from '@/lib/format';

interface Account {
  user: User;
  orders: Order[];
  activity: CreditActivity[];
}

interface AppState {
  /** True once persisted state has been read from AsyncStorage. */
  hydrated: boolean;
  sessionUserId: string | null;
  /** Accounts that have signed in on this device, keyed by user id. */
  accounts: Record<string, Account>;
  /** Last hub code opened on this device. */
  recentHubCode: string | null;
  /** Contact details cached after a successful guest order. */
  guestDetails: ContactDetails | null;
  guestOrders: Order[];

  signIn: (user: User) => void;
  signOut: () => void;
  createAccount: (user: User) => void;
  updateProfile: (patch: Partial<Pick<User, 'name' | 'phone' | 'email'>>) => void;
  joinOrganisation: (org: Organisation) => void;
  leaveOrganisation: (katerId: string) => void;
  setRecentHub: (code: string | null) => void;
  saveGuestDetails: (details: ContactDetails) => void;
  recordOrder: (order: Order) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      sessionUserId: null,
      accounts: {},
      recentHubCode: null,
      guestDetails: null,
      guestOrders: [],

      signIn: (user) => {
        const existing = get().accounts[user.id];
        if (existing) {
          set({ sessionUserId: user.id });
          return;
        }
        const { orders, activity } = seedHistoryFor(user);
        set((s) => ({
          sessionUserId: user.id,
          accounts: { ...s.accounts, [user.id]: { user, orders, activity } },
        }));
      },

      signOut: () => set({ sessionUserId: null }),

      /** New account from guest details. Guest orders placed on this device move across. */
      createAccount: (user) =>
        set((s) => ({
          sessionUserId: user.id,
          accounts: {
            ...s.accounts,
            [user.id]: {
              user,
              orders: s.guestOrders.map((o) => ({ ...o, mode: 'signed-in' as const })),
              activity: [],
            },
          },
          guestOrders: [],
        })),

      updateProfile: (patch) => updateAccount(set, get, (a) => ({ ...a, user: { ...a.user, ...patch } })),

      joinOrganisation: (org) =>
        updateAccount(set, get, (a) =>
          a.user.organisations.some((o) => o.katerId === org.katerId)
            ? a
            : { ...a, user: { ...a.user, organisations: [...a.user.organisations, org] } },
        ),

      leaveOrganisation: (katerId) =>
        updateAccount(set, get, (a) => ({
          ...a,
          user: { ...a.user, organisations: a.user.organisations.filter((o) => o.katerId !== katerId) },
        })),

      setRecentHub: (code) => set({ recentHubCode: code }),

      saveGuestDetails: (details) => set({ guestDetails: details }),

      recordOrder: (order) => {
        const { sessionUserId } = get();
        if (!sessionUserId) {
          set((s) => ({ guestOrders: [order, ...s.guestOrders] }));
          return;
        }
        updateAccount(set, get, (a) => {
          const credits = order.payment.creditsApplied;
          const activity: CreditActivity[] =
            credits > 0
              ? [
                  {
                    id: generateId('act'),
                    date: order.placedAt,
                    amount: -credits,
                    description: order.vendorName,
                    detail: `Order ${order.reference}`,
                    orderId: order.id,
                  },
                  ...a.activity,
                ]
              : a.activity;
          return {
            user: { ...a.user, mealCreditBalance: Math.max(0, a.user.mealCreditBalance - credits) },
            orders: [order, ...a.orders],
            activity,
          };
        });
      },
    }),
    {
      name: 'kater-app-v1',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ hydrated: _hydrated, ...rest }) => rest,
      onRehydrateStorage: () => () => {
        useAppStore.setState({ hydrated: true });
      },
    },
  ),
);

type Setter = (partial: Partial<AppState> | ((s: AppState) => Partial<AppState>)) => void;

function updateAccount(set: Setter, get: () => AppState, fn: (a: Account) => Account) {
  const { sessionUserId, accounts } = get();
  if (!sessionUserId || !accounts[sessionUserId]) return;
  set({ accounts: { ...accounts, [sessionUserId]: fn(accounts[sessionUserId]) } });
}

const EMPTY_ORDERS: Order[] = [];
const EMPTY_ACTIVITY: CreditActivity[] = [];

export const useCurrentUser = () =>
  useAppStore((s) => (s.sessionUserId ? s.accounts[s.sessionUserId]?.user ?? null : null));

export const useIsSignedIn = () => useAppStore((s) => !!s.sessionUserId && !!s.accounts[s.sessionUserId]);

export const useOrders = () =>
  useAppStore((s) => (s.sessionUserId ? s.accounts[s.sessionUserId]?.orders ?? EMPTY_ORDERS : EMPTY_ORDERS));

export const useCreditActivity = () =>
  useAppStore((s) =>
    s.sessionUserId ? s.accounts[s.sessionUserId]?.activity ?? EMPTY_ACTIVITY : EMPTY_ACTIVITY,
  );

/** Finds an order in the signed-in account or among this device's guest orders. */
export const useOrder = (id: string | undefined) =>
  useAppStore((s) => {
    if (!id) return undefined;
    const account = s.sessionUserId ? s.accounts[s.sessionUserId] : undefined;
    return account?.orders.find((o) => o.id === id) ?? s.guestOrders.find((o) => o.id === id);
  });
