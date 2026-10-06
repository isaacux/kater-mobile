import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

import { colors, spacing } from '@/constants/theme';
import type { Order } from '@/data/types';
import { formatDateRange } from '@/lib/dates';
import { formatGHS, pluralise } from '@/lib/format';
import { daysMealCount } from '@/lib/order';
import { Card, StatusPill, Text } from './ui';

export function OrderCard({ order, onPress }: { order: Order; onPress: () => void }) {
  const range = formatDateRange(order.days.map((d) => d.date));
  const meals = daysMealCount(order.days);
  return (
    <Card onPress={onPress} accessibilityLabel={`Order ${order.reference}, ${order.vendorName}, ${range}, ${order.status}`}>
      <View style={styles.top}>
        <Text variant="bodyStrong" style={styles.flex}>
          {range}
        </Text>
        <StatusPill status={order.status} />
      </View>
      <Text variant="body" tone="muted">
        {order.vendorName}
      </Text>
      <View style={styles.bottom}>
        <Text variant="small" tone="muted">
          {pluralise(meals, 'meal')} · {pluralise(order.days.length, 'day')}
        </Text>
        <View style={styles.total}>
          <Text variant="bodyStrong">{formatGHS(order.total)}</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: 2 },
  flex: { flex: 1 },
  bottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.md },
  total: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
