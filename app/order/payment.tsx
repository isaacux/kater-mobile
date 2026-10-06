import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { DraftGuard } from '@/components/DraftGuard';
import {
  Banner,
  Button,
  Card,
  Divider,
  InfoRow,
  Input,
  ProcessingOverlay,
  RadioDot,
  Screen,
  ScreenHeader,
  SectionTitle,
  StepIndicator,
  StickyFooter,
  Text,
} from '@/components/ui';
import { colors, fonts, radius, spacing } from '@/constants/theme';
import type { MomoNetwork } from '@/data/types';
import { useCheckout, usePlaceOrder } from '@/hooks/useCheckout';
import { formatGHS } from '@/lib/format';
import { isValidCardNumber, isValidExpiry, validatePhone } from '@/lib/validation';
import { chargeDirect, redeemCredits } from '@/services/payments';
import { useDraftStore } from '@/store/draft';

const NETWORKS: MomoNetwork[] = ['MTN', 'Telecel', 'AirtelTigo'];

/** Pay directly (mock): Mobile Money or Visa card, then a short processing state. */
export default function Payment() {
  return <DraftGuard requireLocation>{() => <PaymentStep />}</DraftGuard>;
}

function PaymentStep() {
  const { total, creditsApplied, amountDue, user } = useCheckout();
  const contact = useDraftStore((s) => s.contact);
  const placeOrder = usePlaceOrder();

  const [method, setMethod] = useState<'momo' | 'card'>('momo');
  const [network, setNetwork] = useState<MomoNetwork>('MTN');
  const [momoNumber, setMomoNumber] = useState(user?.phone ?? contact?.phone ?? '');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const momoError = validatePhone(momoNumber);
  const cardErrors = {
    number: isValidCardNumber(cardNumber) ? null : 'Enter a valid card number.',
    expiry: isValidExpiry(expiry) ? null : 'Enter a future date as MM/YY.',
    cvv: /^\d{3}$/.test(cvv) ? null : 'Enter the 3-digit code on the back.',
  };
  const valid = method === 'momo' ? !momoError : !cardErrors.number && !cardErrors.expiry && !cardErrors.cvv;

  const pay = async () => {
    setSubmitted(true);
    setError(null);
    if (!valid) return;
    setProcessing(true);
    try {
      const result =
        method === 'momo'
          ? await chargeDirect({ kind: 'momo', amount: amountDue, network, phone: momoNumber })
          : await chargeDirect({ kind: 'card', amount: amountDue, cardNumber, expiry, cvv });
      if (creditsApplied > 0) await redeemCredits(creditsApplied);
      setProcessing(false);
      placeOrder({ method, label: result.label });
    } catch (e) {
      setProcessing(false);
      setError(e instanceof Error ? e.message : 'Payment failed. Please try again.');
    }
  };

  return (
    <Screen
      header={
        <>
          <ScreenHeader title="Payment" />
          <StepIndicator current="Review" />
        </>
      }
      footer={
        <StickyFooter>
          <Button label={`Pay ${formatGHS(amountDue)}`} icon="lock-closed" onPress={pay} loading={processing} />
        </StickyFooter>
      }
    >
      <Card>
        <Text variant="caption" tone="muted">
          Amount to pay
        </Text>
        <Text variant="display">{formatGHS(amountDue)}</Text>
        {creditsApplied > 0 ? (
          <View style={styles.breakdown}>
            <InfoRow label="Order total" value={formatGHS(total)} />
            <InfoRow label="Meal credits applied" value={`− ${formatGHS(creditsApplied)}`} />
            <Divider spacing={spacing.xs} />
            <InfoRow label="Pay directly" value={formatGHS(amountDue)} strong />
          </View>
        ) : null}
      </Card>

      <SectionTitle title="Pay with" />
      <View style={styles.methods} accessibilityRole="radiogroup">
        <MethodCard
          selected={method === 'momo'}
          onPress={() => setMethod('momo')}
          icon="phone-portrait-outline"
          title="Mobile Money"
          body="MTN, Telecel or AirtelTigo"
        />
        <MethodCard
          selected={method === 'card'}
          onPress={() => setMethod('card')}
          icon="card-outline"
          title="Visa card"
          body="Debit or credit"
        />
      </View>

      {method === 'momo' ? (
        <Card>
          <View style={styles.form}>
            <Text variant="smallStrong">Network</Text>
            <View style={styles.networks} accessibilityRole="radiogroup">
              {NETWORKS.map((n) => (
                <Pressable
                  key={n}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: network === n }}
                  onPress={() => setNetwork(n)}
                  style={[styles.network, network === n && styles.networkSelected]}
                >
                  <Text style={styles.networkText}>{n}</Text>
                </Pressable>
              ))}
            </View>
            <Input
              label="Mobile Money number"
              value={momoNumber}
              onChangeText={setMomoNumber}
              keyboardType="phone-pad"
              placeholder="024 123 4567"
              error={submitted ? momoError : null}
              hint="You'll get a prompt on this phone to approve the payment."
            />
          </View>
        </Card>
      ) : (
        <Card>
          <View style={styles.form}>
            <Input
              label="Card number"
              value={cardNumber}
              onChangeText={(t) =>
                setCardNumber(
                  t
                    .replace(/\D/g, '')
                    .slice(0, 16)
                    .replace(/(\d{4})(?=\d)/g, '$1 '),
                )
              }
              keyboardType="number-pad"
              placeholder="4242 4242 4242 4242"
              autoComplete="cc-number"
              error={submitted ? cardErrors.number : null}
              left={<Ionicons name="card" size={20} color={colors.textMuted} />}
            />
            <View style={styles.cardRow}>
              <View style={styles.flex}>
                <Input
                  label="Expiry"
                  value={expiry}
                  onChangeText={(t) => {
                    const d = t.replace(/\D/g, '').slice(0, 4);
                    setExpiry(d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d);
                  }}
                  keyboardType="number-pad"
                  placeholder="MM/YY"
                  autoComplete="cc-exp"
                  error={submitted ? cardErrors.expiry : null}
                />
              </View>
              <View style={styles.flex}>
                <Input
                  label="CVV"
                  value={cvv}
                  onChangeText={(t) => setCvv(t.replace(/\D/g, '').slice(0, 3))}
                  keyboardType="number-pad"
                  placeholder="123"
                  secureTextEntry
                  autoComplete="cc-csc"
                  error={submitted ? cardErrors.cvv : null}
                />
              </View>
            </View>
          </View>
        </Card>
      )}

      {error ? (
        <Banner tone="error" title="Payment not completed">
          {error}
        </Banner>
      ) : null}

      <View style={styles.secure}>
        <Ionicons name="shield-checkmark-outline" size={16} color={colors.textMuted} />
        <Text variant="caption" tone="muted">
          Prototype: no real payment is taken.
        </Text>
      </View>

      <ProcessingOverlay
        visible={processing}
        title={method === 'momo' ? 'Waiting for approval' : 'Processing payment'}
        body={
          method === 'momo'
            ? `Approve the ${network} Mobile Money prompt on your phone to pay ${formatGHS(amountDue)}.`
            : `Charging ${formatGHS(amountDue)} to your Visa card.`
        }
      />
    </Screen>
  );
}

function MethodCard({
  selected,
  onPress,
  icon,
  title,
  body,
}: {
  selected: boolean;
  onPress: () => void;
  icon: ComponentProps<typeof Ionicons>['name'];
  title: string;
  body: string;
}) {
  return (
    <Card onPress={onPress} selected={selected} accessibilityRole="radio" accessibilityLabel={title} style={styles.flex}>
      <View style={styles.methodTop}>
        <Ionicons name={icon} size={24} color={colors.black} />
        <RadioDot selected={selected} />
      </View>
      <Text variant="bodyStrong">{title}</Text>
      <Text variant="caption" tone="muted">
        {body}
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  breakdown: { gap: spacing.sm, marginTop: spacing.md },
  methods: { flexDirection: 'row', gap: spacing.md },
  methodTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  form: { gap: spacing.lg },
  networks: { flexDirection: 'row', gap: spacing.sm, marginTop: -spacing.sm },
  network: {
    flex: 1,
    minHeight: 48,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  networkSelected: { backgroundColor: colors.yellow, borderColor: colors.black, borderWidth: 2 },
  networkText: { fontFamily: fonts.semibold, fontSize: 14 },
  cardRow: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  secure: { flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center' },
});
