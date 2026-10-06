import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '@/constants/theme';
import type { Vendor } from '@/data/types';
import { formatGHS } from '@/lib/format';
import { RemoteImage } from './RemoteImage';
import { Card, Text } from './ui';

export function VendorCard({ vendor, onPress }: { vendor: Vendor; onPress: () => void }) {
  return (
    <Card
      onPress={onPress}
      padded={false}
      accessibilityLabel={`${vendor.name}, ${formatGHS(vendor.pricePerMeal)} per meal, delivers ${vendor.deliveryWindow}`}
    >
      <RemoteImage uri={vendor.image} style={styles.image} label={vendor.name} dark />
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <View style={styles.flex}>
            <Text variant="h2">{vendor.name}</Text>
            <Text variant="small" tone="muted">
              {vendor.cuisine} · {vendor.meals.length} meals
            </Text>
          </View>
          <View style={styles.go}>
            <Ionicons name="arrow-forward" size={20} color={colors.black} />
          </View>
        </View>
        <View style={styles.metaRow}>
          <View style={styles.price}>
            <Text variant="smallStrong">{formatGHS(vendor.pricePerMeal)} per meal</Text>
          </View>
          <View style={styles.meta}>
            <Ionicons name="time-outline" size={16} color={colors.textMuted} />
            <Text variant="small" tone="muted">
              {vendor.deliveryWindow}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 140,
    borderTopLeftRadius: radius.lg - 1.5,
    borderTopRightRadius: radius.lg - 1.5,
    backgroundColor: colors.black,
  },
  body: { padding: spacing.lg, gap: spacing.md },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  flex: { flex: 1, gap: 2 },
  go: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.yellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: spacing.md },
  price: { backgroundColor: colors.yellowSoft, paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
