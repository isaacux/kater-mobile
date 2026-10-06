import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { OrderDayCard } from '@/components/OrderDayCard';
import { PaymentBreakdownCard } from '@/components/PaymentBreakdownCard';
import { Card, Divider, EmptyState, InfoRow, Screen, ScreenHeader, SectionTitle, StatusPill, Text } from '@/components/ui';
import { spacing } from '@/constants/theme';
import { formatDateRange, formatTimestamp } from '@/lib/dates';
import { formatGHS, pluralise } from '@/lib/format';
import { daysMealCount } from '@/lib/order';
import { useOrder } from '@/store/app';

export default function OrderDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const order = useOrder(id);

  if (!order) {
    return (
      <Screen header={<ScreenHeader title="Order" />}>
        <EmptyState icon="receipt-outline" title="Order not found" body="This order may have been removed from this device." />
      </Screen>
    );
  }

  return (
    <Screen header={<ScreenHeader title={order.reference} subtitle={order.vendorName} />}>
      <Card>
        <View style={styles.top}>
          <Text variant="h2" style={styles.flex}>
            {formatDateRange(order.days.map((d) => d.date))}
          </Text>
          <StatusPill status={order.status} />
        </View>
        <Text variant="small" tone="muted">
          Placed {formatTimestamp(order.placedAt)}
        </Text>
        <Divider />
        <View style={styles.rows}>
          <InfoRow label="Vendor" value={order.vendorName} />
          <InfoRow label="Canteen" value={order.companyName} />
          <InfoRow label="Delivery to" value={order.location.label} />
          <InfoRow label="Delivery window" value={order.deliveryWindow} />
          <InfoRow label="Meals" value={pluralise(daysMealCount(order.days), 'meal')} />
        </View>
      </Card>

      <SectionTitle title="By date" />
      {order.days.map((day) => (
        <OrderDayCard key={day.date} day={day} />
      ))}

      <Card>
        <InfoRow label="Order total" value={formatGHS(order.total)} strong />
      </Card>

      <PaymentBreakdownCard payment={order.payment} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: 4 },
  flex: { flex: 1 },
  rows: { gap: spacing.sm },
});
