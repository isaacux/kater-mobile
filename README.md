# Kater Hubs (prototype)

A clickable mobile prototype of **Kater Hubs**: a private online canteen for companies in Ghana. Staff enter their company's hub code, pick a vendor and order lunch for one or more working days, either as a guest or signed in.

Everything runs on the device with mock data. There is no backend, no real authentication and no real payments.

## Setup

Requirements: Node.js 20+ and the **Expo Go** app (SDK 57) on an iOS or Android phone.

```bash
npm install
npx expo start
```

Scan the QR code with the Camera app (iOS) or Expo Go (Android). Press `i` or `a` in the terminal to open an iOS simulator or Android emulator instead.

Useful scripts:

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # expo lint
```

To reset the prototype (recent hub, saved guest details, accounts and orders), sign out and delete the app's data in Expo Go, or clear Expo Go's storage.

## Mock data

### Hub codes

Codes are case-insensitive and ignore spaces.

| Code      | Company               | Vendors                                                        | Delivery locations                                         |
| --------- | --------------------- | -------------------------------------------------------------- | ---------------------------------------------------------- |
| `TOTAL24` | Totality Energy Ghana | Auntie Muni's Kitchen (GHS 55), Accra Grill House (GHS 65), Green Bowl Co. (GHS 70) | Ground Floor Reception, 3rd Floor, 5th Floor, 7th Floor |
| `OMA2026` | Omanye Capital        | Chop Bar Royale (GHS 50), Osu Spice Kitchen (GHS 60), Fresh & Lean (GHS 75), Bistro 233 (GHS 80) | Airport City Branch, Ridge Head Office, Osu Branch |

Each vendor has 6 to 8 meals with dietary tags. Images are placeholders from placehold.co, with a branded fallback when offline.

### Sign-in accounts

Sign-in accepts **any 6-digit code**.

| Phone or email                                | Account                                                                 |
| --------------------------------------------- | ----------------------------------------------------------------------- |
| `024 123 4567` or `ama.mensah@example.com`    | Ama Mensah: GHS 240.00 meal credits from Totality Energy Ghana, order history |
| `020 111 2222` or `kwame@example.com`         | Kwame Boateng: no employer, no credits (shows empty states)            |
| Any other valid Ghana number or email         | Signs in as the Ama demo account with that phone or email              |

Try these payment cases with Ama's GHS 240.00 balance:

- **Credits cover the order**: e.g. 2 meals at GHS 55. Meal credits is selected by default.
- **Credits are not enough**: e.g. 5 days at Chop Bar Royale (GHS 250). Tick *Use my remaining meal credits* to pay GHS 10.00 directly.
- **No credits**: sign in as Kwame, or use up Ama's balance.

### Organisation Kater IDs

Use these to join an organisation from Account:

`KTR-TOT-1024` (Totality Energy Ghana) · `KTR-OMA-2026` (Omanye Capital) · `KTR-KAS-3310` (Kasoa Logistics Ltd) · `KTR-ACC-0077` (Accra Tech Hub)

### Payment test values

Payments are simulated with a short processing state.

| Method       | Succeeds with                       | Declines with           |
| ------------ | ----------------------------------- | ----------------------- |
| Mobile Money | Any valid Ghana number              | `024 000 0000`          |
| Visa card    | `4242 4242 4242 4242`, any future expiry, any 3-digit CVV | `4000 0000 0000 0002` |

## Product rules in this prototype

- **Ordering cutoff**: a date can be ordered until 6:00pm the day before. Change `ORDER_CUTOFF_HOUR` in `constants/config.ts`. Past-cutoff dates are shown greyed out with an explanation.
- **Working days only**: the dates step shows Monday to Friday for this week and the next two (`ORDERING_WEEKS_AHEAD`).
- **Meals on every date**: *Review order* stays disabled until every selected date has at least one meal. The footer says which dates still need meals.
- **One price per vendor**: totals are quantity × the vendor's price per meal. Prices always show as `GHS 55.00`.
- **Credits logic** (signed in): full cover selects meal credits by default; partial cover offers a checkbox to apply the remaining balance; no credits leaves only *Pay directly*. The pay button always shows the amount actually charged.
- **Guest details** are cached on the device after a successful order and prefilled next time. The success screen offers to turn them into an account; guest orders placed on the device move into the new account.
- The **last hub** opened is saved on the device. Signed-in Home opens straight to its vendors; the guest hub screen offers it as a one-tap shortcut.

## Project layout

```
app/                    Expo Router screens
  index.tsx             Entry: Sign in or Order as a guest
  sign-in.tsx, verify.tsx, create-account.tsx
  hub.tsx, vendors.tsx  Guest hub code and vendor list
  (tabs)/               Signed-in tabs: home, orders, credits, account
  order/                Shared flow: location, dates, meals, review, payment, success
  order-detail/[id].tsx Order detail
  profile.tsx, join-organisation.tsx
components/             Feature components (vendor/meal cards, meal bottom sheet, summaries)
components/ui/          Design system: Text, Button, Card, Input, QuantityStepper, StepIndicator, ...
constants/              Theme tokens and config (cutoff time, latency)
data/                   Typed models (types.ts) and seed data (hubs, users, order history)
hooks/                  Checkout calculations and order placement
lib/                    Dates, formatting, validation, order maths
services/               Mock services: auth, hubs, organisations, payments, orders
store/                  Zustand stores: persisted app state and the in-memory order draft
```

### Swapping mocks for real services

Screens only talk to `services/*`, which return promises with simulated latency. Replace those functions with API calls (for example `lookupHub`, `requestCode`/`verifyCode`, `chargeDirect`, `redeemCredits`, `createOrder`) without changing the screens. Persisted state lives in `store/app.ts` (AsyncStorage via Zustand `persist`).

## Tech

Expo SDK 57 · React Native 0.86 · TypeScript · Expo Router · Zustand · AsyncStorage · `@gorhom/bottom-sheet` · Inter via `@expo-google-fonts/inter`.
