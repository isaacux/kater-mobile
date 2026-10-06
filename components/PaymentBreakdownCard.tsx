import { StyleSheet, View } from 'react-native';

import { spacing } from '@/constants/theme';
import type { PaymentBreakdown } from '@/data/types';
import { formatGHS } from '@/lib/format';
import { Card, Divider, InfoRow, Text } from './ui';

export function PaymentBreakdownCard({ payment, title = 'Payment' }: { payment: PaymentBreakdown; title?: string }) {
  return (
    <Card>
      <Text variant="h3" style={styles.title}>
        {title}
      </Text>
      <View style={styles.rows}>
        <InfoRow label="Order total" value={formatGHS(payment.total)} />
        <InfoRow
          label="Meal credits used"
          value={payment.creditsApplied > 0 ? `− ${formatGHS(payment.creditsApplied)}` : formatGHS(0)}
        />
        <Divider spacing={spacing.xs} />
        <InfoRow label="Amount paid" value={formatGHS(payment.amountPaid)} strong />
        {payment.directMethodLabel ? (
          <Text variant="small" tone="muted">
            Paid with {payment.directMethodLabel}
          </Text>
        ) : payment.creditsApplied > 0 && payment.amountPaid === 0 ? (
          <Text variant="small" tone="muted">
            Fully paid with meal credits
          </Text>
        ) : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  title: { marginBottom: spacing.md },
  rows: { gap: spacing.sm },
});
