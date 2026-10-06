import { StyleSheet, View } from 'react-native';

import { spacing } from '@/constants/theme';
import type { Hub, Vendor } from '@/data/types';
import { EmptyState, LinkButton, Text } from './ui';
import { VendorCard } from './VendorCard';

/** Company canteen: header with company name and Change hub, then vendor cards. */
export function VendorList({
  hub,
  onSelectVendor,
  onChangeHub,
}: {
  hub: Hub;
  onSelectVendor: (vendor: Vendor) => void;
  onChangeHub: () => void;
}) {
  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text variant="overline" tone="muted">
          Your canteen
        </Text>
        <Text variant="h1">{hub.companyName}</Text>
        <View style={styles.headerRow}>
          <Text variant="small" tone="muted">
            Hub code {hub.code}
          </Text>
          <LinkButton label="Change hub" icon="swap-horizontal" onPress={onChangeHub} />
        </View>
      </View>
      <Text variant="body" tone="muted">
        Pick a vendor to start your order. Each vendor has one price for every meal.
      </Text>
      {hub.vendors.length === 0 ? (
        <EmptyState
          icon="restaurant-outline"
          title="No vendors yet"
          body="Your canteen doesn't have any vendors right now. Check back soon."
        />
      ) : (
        hub.vendors.map((v) => <VendorCard key={v.id} vendor={v} onPress={() => onSelectVendor(v)} />)
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.lg },
  header: { gap: 4 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
