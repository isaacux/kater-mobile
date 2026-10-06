import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';

import { PaymentBreakdownCard } from '@/components/PaymentBreakdownCard';
import { Button, Card, Divider, EmptyState, Screen, StickyFooter, Text } from '@/components/ui';
import { colors, radius, spacing } from '@/constants/theme';
import { formatLongDate } from '@/lib/dates';
import { daysMealCount } from '@/lib/order';
import { pluralise } from '@/lib/format';
import { useIsSignedIn } from '@/store/app';
import { useDraftStore } from '@/store/draft';

export default function Success() {
  const order = useDraftStore((s) => s.lastOrder);
  const signedIn = useIsSignedIn();

  const done = useCallback(() => {
    if (signedIn) router.dismissTo('/home');
    else if (order) router.dismissTo({ pathname: '/vendors', params: { code: order.hubCode } });
    else router.dismissTo('/');
  }, [signedIn, order]);

  // Android back acts like Done, so people can't step back into a paid order.
  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => {
        done();
        return true;
      });
      return () => sub.remove();
    }, [done]),
  );

  if (!order) {
    return (
      <Screen scroll={false} contentStyle={styles.center}>
        <EmptyState icon="receipt-outline" title="No recent order" action={<Button label="Done" onPress={done} />} />
      </Screen>
    );
  }

  const isGuestOrder = order.mode === 'guest' && !signedIn;

  return (
    <Screen
      edges={['top']}
      footer={
        <StickyFooter>
          <Button label="Done" onPress={done} />
          {signedIn ? (
            <Button
              label="View order"
              variant="ghost"
              onPress={() => {
                router.dismissTo('/home');
                router.push({ pathname: '/order-detail/[id]', params: { id: order.id } });
              }}
            />
          ) : null}
        </StickyFooter>
      }
    >
      <View style={styles.hero}>
        <View style={styles.check}>
          <Ionicons name="checkmark" size={44} color={colors.black} />
        </View>
        <Text variant="h1" align="center" accessibilityRole="header">
          Order confirmed
        </Text>
        <Text variant="body" tone="muted" align="center">
          Thanks, {order.customer.name.split(' ')[0]}. {order.vendorName} will deliver your lunch. A receipt has been sent
          to {order.customer.email}.
        </Text>
      </View>

      <Card>
        <Text variant="caption" tone="muted">
          Order reference
        </Text>
        <Text variant="h1" selectable style={styles.ref}>
          {order.reference}
        </Text>
        <Divider />
        <View style={styles.details}>
          <Detail icon="location-outline" label="Delivery location" value={order.location.label} />
          <Detail icon="time-outline" label="Delivery window" value={order.deliveryWindow} />
          <Detail
            icon="calendar-outline"
            label={`${pluralise(order.days.length, 'date')} · ${pluralise(daysMealCount(order.days), 'meal')}`}
            value={order.days.map((d) => formatLongDate(d.date)).join('\n')}
          />
        </View>
      </Card>

      <PaymentBreakdownCard payment={order.payment} />

      {isGuestOrder ? (
        <Card style={styles.saveCard}>
          <View style={styles.saveRow}>
            <Ionicons name="person-add-outline" size={24} color={colors.black} />
            <View style={styles.flex}>
              <Text variant="h3">Save your details for next time</Text>
              <Text variant="small" tone="muted">
                Create an account to check out faster, see your orders and use meal credits from your employer.
              </Text>
            </View>
          </View>
          <Button label="Create an account" variant="secondary" size="md" onPress={() => router.push('/create-account')} />
        </Card>
      ) : null}
    </Screen>
  );
}

function Detail({ icon, label, value }: { icon: 'location-outline' | 'time-outline' | 'calendar-outline'; label: string; value: string }) {
  return (
    <View style={styles.detail}>
      <Ionicons name={icon} size={20} color={colors.textMuted} style={styles.detailIcon} />
      <View style={styles.flex}>
        <Text variant="caption" tone="muted">
          {label}
        </Text>
        <Text variant="bodyStrong">{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { justifyContent: 'center' },
  hero: { alignItems: 'center', gap: spacing.md, paddingVertical: spacing.lg },
  check: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  ref: { letterSpacing: 1 },
  details: { gap: spacing.lg },
  detail: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
  detailIcon: { marginTop: 10 },
  flex: { flex: 1, gap: 2 },
  saveCard: { gap: spacing.lg, borderColor: colors.yellow, borderWidth: 2, borderRadius: radius.lg },
  saveRow: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start' },
});
