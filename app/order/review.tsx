import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState, type ComponentProps, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { DraftGuard } from '@/components/DraftGuard';
import { OrderDayCard } from '@/components/OrderDayCard';
import {
  Banner,
  Button,
  Card,
  Checkbox,
  Divider,
  InfoRow,
  Input,
  LinkButton,
  ProcessingOverlay,
  RadioDot,
  Screen,
  ScreenHeader,
  SectionTitle,
  StepIndicator,
  StickyFooter,
  Text,
} from '@/components/ui';
import { colors, radius, spacing } from '@/constants/theme';
import { useCheckout, usePlaceOrder } from '@/hooks/useCheckout';
import { formatDateRange } from '@/lib/dates';
import { formatGHS, pluralise } from '@/lib/format';
import { validateEmail, validateName, validatePhone } from '@/lib/validation';
import { redeemCredits } from '@/services/payments';
import { useAppStore } from '@/store/app';
import { useDraftStore } from '@/store/draft';

export default function Review() {
  return <DraftGuard requireLocation>{() => <ReviewStep />}</DraftGuard>;
}

function ReviewStep() {
  const checkout = useCheckout();
  const { hub, vendor, location, days, total, mealCount, signedIn, coverage, useCredits, creditsApplied, amountDue, balance, user } =
    checkout;
  const setNote = useDraftStore((s) => s.setNote);
  const setActiveDate = useDraftStore((s) => s.setActiveDate);
  const setUseCredits = useDraftStore((s) => s.setUseCredits);
  const setContact = useDraftStore((s) => s.setContact);
  const draftContact = useDraftStore((s) => s.contact);
  const cachedGuest = useAppStore((s) => s.guestDetails);
  const placeOrder = usePlaceOrder();

  const initial = draftContact ?? cachedGuest;
  const [name, setName] = useState(initial?.name ?? '');
  const [phone, setPhone] = useState(initial?.phone ?? '');
  const [email, setEmail] = useState(initial?.email ?? '');
  const [touched, setTouched] = useState({ name: false, phone: false, email: false });
  const [submitted, setSubmitted] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  if (!hub || !vendor || !location) return null;

  const errors = { name: validateName(name), phone: validatePhone(phone), email: validateEmail(email) };
  const show = (k: keyof typeof touched) => (submitted || touched[k] ? errors[k] : null);
  const guestValid = !errors.name && !errors.phone && !errors.email;

  const vendorListHref = signedIn ? '/home' : ({ pathname: '/vendors', params: { code: hub.code } } as const);
  const payWithCreditsOnly = signedIn && useCredits && amountDue === 0;

  const onPay = async () => {
    setPayError(null);
    if (!signedIn) {
      setSubmitted(true);
      if (!guestValid) return;
      setContact({ name: name.trim(), phone: phone.trim(), email: email.trim() });
      router.push('/order/payment');
      return;
    }
    if (payWithCreditsOnly) {
      setProcessing(true);
      try {
        await redeemCredits(creditsApplied);
        setProcessing(false);
        placeOrder(null);
      } catch (e) {
        setProcessing(false);
        setPayError(e instanceof Error ? e.message : 'We could not apply your credits. Please try again.');
      }
      return;
    }
    router.push('/order/payment');
  };

  const payLabel = payWithCreditsOnly ? 'Pay with meal credits' : `Pay ${formatGHS(amountDue)}`;

  return (
    <Screen
      header={
        <>
          <ScreenHeader title="Review order" subtitle={hub.companyName} />
          <StepIndicator current="Review" />
        </>
      }
      footer={
        <StickyFooter>
          <View style={styles.footerRow}>
            <Text variant="body" tone="muted">
              {creditsApplied > 0 && amountDue > 0 ? 'Amount to pay' : 'Order total'}
            </Text>
            <Text variant="h2">{formatGHS(creditsApplied > 0 && amountDue > 0 ? amountDue : total)}</Text>
          </View>
          <Button label={payLabel} onPress={onPay} icon={payWithCreditsOnly ? 'wallet' : 'lock-closed'} />
        </StickyFooter>
      }
    >
      {/* Delivery details with edit links back to each step */}
      <Card>
        <DetailRow
          icon="storefront-outline"
          label="Vendor"
          value={vendor.name}
          meta={`${formatGHS(vendor.pricePerMeal)} per meal`}
          action={<LinkButton label="Change" onPress={() => router.dismissTo(vendorListHref)} />}
        />
        <Divider />
        <DetailRow
          icon="location-outline"
          label="Delivery location"
          value={location.label}
          meta={location.detail}
          action={<LinkButton label="Edit" onPress={() => router.dismissTo('/order/location')} />}
        />
        <Divider />
        <DetailRow icon="time-outline" label="Delivery window" value={vendor.deliveryWindow} meta="Set by the vendor" />
        <Divider />
        <DetailRow
          icon="calendar-outline"
          label="Dates"
          value={formatDateRange(days.map((d) => d.date))}
          meta={pluralise(days.length, 'delivery day')}
          action={<LinkButton label="Edit" onPress={() => router.dismissTo('/order/dates')} />}
        />
      </Card>

      <SectionTitle title={`Your meals · ${pluralise(mealCount, 'meal')}`} />
      {days.map((day) => (
        <OrderDayCard
          key={day.date}
          day={day}
          onEdit={() => {
            setActiveDate(day.date);
            router.dismissTo('/order/meals');
          }}
          onChangeNote={(note) => setNote(day.date, note)}
        />
      ))}

      <Card>
        <InfoRow label={`${pluralise(mealCount, 'meal')} × ${formatGHS(vendor.pricePerMeal)}`} value={formatGHS(total)} />
        <Divider spacing={spacing.sm} />
        <InfoRow label="Order total" value={formatGHS(total)} strong />
      </Card>

      {signedIn && user ? (
        <>
          <SectionTitle title="Payment" />
          {coverage === 'full' ? (
            <View style={styles.options} accessibilityRole="radiogroup">
              <PaymentOption
                selected={useCredits}
                onPress={() => setUseCredits(true)}
                icon="wallet-outline"
                title="Meal credits"
                body={`Balance ${formatGHS(balance)} · covers this order`}
              />
              <PaymentOption
                selected={!useCredits}
                onPress={() => setUseCredits(false)}
                icon="card-outline"
                title="Pay directly"
                body="Mobile Money or Visa card"
              />
            </View>
          ) : coverage === 'partial' ? (
            <Card>
              <View style={styles.creditsHead}>
                <View style={styles.optionIcon}>
                  <Ionicons name="wallet-outline" size={22} color={colors.black} />
                </View>
                <View style={styles.flex}>
                  <Text variant="bodyStrong">Meal credits</Text>
                  <Text variant="small" tone="muted">
                    Balance {formatGHS(balance)} · not enough for the full order
                  </Text>
                </View>
              </View>
              <Divider />
              <Checkbox
                checked={useCredits}
                onChange={setUseCredits}
                label={`Use my remaining meal credits (${formatGHS(balance)})`}
                description="Pay the rest directly with Mobile Money or Visa card."
              />
              <View style={styles.breakdown}>
                <InfoRow label="Order total" value={formatGHS(total)} />
                <InfoRow label="Credits applied" value={creditsApplied > 0 ? `− ${formatGHS(creditsApplied)}` : formatGHS(0)} />
                <Divider spacing={spacing.xs} />
                <InfoRow label="Amount to pay" value={formatGHS(amountDue)} strong />
              </View>
            </Card>
          ) : (
            <View style={styles.options}>
              <PaymentOption
                selected={false}
                disabled
                icon="wallet-outline"
                title="Meal credits"
                body="No credits available. Credits are funded by your employer."
              />
              <PaymentOption selected icon="card-outline" title="Pay directly" body="Mobile Money or Visa card" />
            </View>
          )}
        </>
      ) : (
        <>
          <SectionTitle title="Your details" />
          <Card>
            <View style={styles.form}>
              <Text variant="small" tone="muted">
                We’ll send your receipt and delivery updates here.
              </Text>
              <Input
                label="Name"
                value={name}
                onChangeText={setName}
                onBlur={() => setTouched((t) => ({ ...t, name: true }))}
                autoComplete="name"
                textContentType="name"
                placeholder="Ama Mensah"
                error={show('name')}
              />
              <Input
                label="Phone number"
                value={phone}
                onChangeText={setPhone}
                onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                keyboardType="phone-pad"
                autoComplete="tel"
                textContentType="telephoneNumber"
                placeholder="024 123 4567"
                error={show('phone')}
              />
              <Input
                label="Email address"
                value={email}
                onChangeText={setEmail}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                textContentType="emailAddress"
                placeholder="ama@company.com"
                error={show('email')}
              />
              {cachedGuest ? (
                <Text variant="caption" tone="muted">
                  Filled in from your last order on this device.
                </Text>
              ) : null}
            </View>
          </Card>
          {submitted && !guestValid ? <Banner tone="error">Check your details above before paying.</Banner> : null}
        </>
      )}

      {payError ? <Banner tone="error" title="Payment failed">{payError}</Banner> : null}

      <ProcessingOverlay visible={processing} title="Applying meal credits" body="This will only take a moment." />
    </Screen>
  );
}

function DetailRow({
  icon,
  label,
  value,
  meta,
  action,
}: {
  icon: ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
  meta?: string;
  action?: ReactNode;
}) {
  return (
    <View style={styles.detail}>
      <Ionicons name={icon} size={20} color={colors.textMuted} style={styles.detailIcon} />
      <View style={styles.flex}>
        <Text variant="caption" tone="muted">
          {label}
        </Text>
        <Text variant="bodyStrong">{value}</Text>
        {meta ? (
          <Text variant="small" tone="muted">
            {meta}
          </Text>
        ) : null}
      </View>
      {action}
    </View>
  );
}

function PaymentOption({
  selected,
  onPress,
  icon,
  title,
  body,
  disabled,
}: {
  selected: boolean;
  onPress?: () => void;
  icon: ComponentProps<typeof Ionicons>['name'];
  title: string;
  body: string;
  disabled?: boolean;
}) {
  return (
    <Card
      onPress={onPress ?? (() => {})}
      selected={selected}
      disabled={disabled}
      accessibilityRole="radio"
      accessibilityLabel={`${title}. ${body}`}
    >
      <View style={styles.optionRow}>
        <View style={[styles.optionIcon, selected && styles.optionIconSelected]}>
          <Ionicons name={icon} size={22} color={disabled ? colors.disabledText : colors.black} />
        </View>
        <View style={styles.flex}>
          <Text variant="bodyStrong" tone={disabled ? 'disabled' : 'default'}>
            {title}
          </Text>
          <Text variant="small" tone="muted">
            {body}
          </Text>
        </View>
        <RadioDot selected={selected} disabled={disabled} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, gap: 2 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  detail: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  detailIcon: { marginTop: 14 },
  options: { gap: spacing.md },
  optionRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionIconSelected: { backgroundColor: colors.yellow },
  creditsHead: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  breakdown: { gap: spacing.sm, marginTop: spacing.md, padding: spacing.md, backgroundColor: colors.offWhite, borderRadius: radius.md },
  form: { gap: spacing.lg },
});
