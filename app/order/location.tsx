import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { DraftGuard } from '@/components/DraftGuard';
import { Button, Card, RadioDot, Screen, ScreenHeader, StepIndicator, StickyFooter, Text } from '@/components/ui';
import { colors, spacing } from '@/constants/theme';
import { useDraftStore } from '@/store/draft';

export default function SelectLocation() {
  const locationId = useDraftStore((s) => s.locationId);
  const setLocation = useDraftStore((s) => s.setLocation);

  return (
    <DraftGuard>
      {({ hub, vendor }) => (
        <Screen
          header={
            <>
              <ScreenHeader title={vendor.name} subtitle={hub.companyName} />
              <StepIndicator current="Location" />
            </>
          }
          footer={
            <StickyFooter>
              <Button
                label="Continue"
                iconRight="arrow-forward"
                disabled={!locationId}
                onPress={() => router.push('/order/dates')}
              />
            </StickyFooter>
          }
        >
          <View style={styles.intro}>
            <Text variant="h1">Where should we deliver?</Text>
            <Text variant="body" tone="muted">
              Choose one delivery point for this order.
            </Text>
          </View>
          <View style={styles.list} accessibilityRole="radiogroup">
            {hub.deliveryLocations.map((loc) => {
              const selected = loc.id === locationId;
              return (
                <Card
                  key={loc.id}
                  onPress={() => setLocation(loc.id)}
                  selected={selected}
                  accessibilityRole="radio"
                  accessibilityLabel={`${loc.label}${loc.detail ? `, ${loc.detail}` : ''}`}
                >
                  <View style={styles.row}>
                    <View style={[styles.icon, selected && styles.iconSelected]}>
                      <Ionicons name="location" size={22} color={colors.black} />
                    </View>
                    <View style={styles.flex}>
                      <Text variant="bodyStrong">{loc.label}</Text>
                      {loc.detail ? (
                        <Text variant="small" tone="muted">
                          {loc.detail}
                        </Text>
                      ) : null}
                    </View>
                    <RadioDot selected={selected} />
                  </View>
                </Card>
              );
            })}
          </View>
        </Screen>
      )}
    </DraftGuard>
  );
}

const styles = StyleSheet.create({
  intro: { gap: spacing.sm },
  list: { gap: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, minHeight: 44 },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSelected: { backgroundColor: colors.yellow },
  flex: { flex: 1, gap: 2 },
});
