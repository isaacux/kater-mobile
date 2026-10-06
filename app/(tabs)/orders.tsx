import { router } from 'expo-router';
import { useMemo } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OrderCard } from '@/components/OrderCard';
import { Button, EmptyState, Text } from '@/components/ui';
import { colors, spacing } from '@/constants/theme';
import { useOrders } from '@/store/app';

export default function Orders() {
  const orders = useOrders();
  const sorted = useMemo(() => [...orders].sort((a, b) => b.placedAt.localeCompare(a.placedAt)), [orders]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <FlatList
        data={sorted}
        keyExtractor={(o) => o.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text variant="h1" accessibilityRole="header">
              Orders
            </Text>
            <Text variant="body" tone="muted">
              Newest first
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            onPress={() => router.push({ pathname: '/order-detail/[id]', params: { id: item.id } })}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="receipt-outline"
            title="No orders yet"
            body="When you order lunch, it will show up here so you can track deliveries."
            action={<Button label="Order lunch" onPress={() => router.navigate('/home')} />}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.offWhite },
  list: { padding: spacing.xl, gap: spacing.md, flexGrow: 1 },
  header: { gap: 4, marginBottom: spacing.sm },
});
