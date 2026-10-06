import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

import { colors, fonts, radius, spacing } from '@/constants/theme';
import { Text } from './Text';

export const ORDER_STEPS = ['Location', 'Dates', 'Meals', 'Review'] as const;
export type OrderStep = (typeof ORDER_STEPS)[number];

export function StepIndicator({ current }: { current: OrderStep }) {
  const currentIndex = ORDER_STEPS.indexOf(current);
  return (
    <View
      style={styles.wrap}
      accessibilityRole="progressbar"
      accessibilityLabel={`Step ${currentIndex + 1} of ${ORDER_STEPS.length}: ${current}`}
    >
      {ORDER_STEPS.map((step, i) => {
        const done = i < currentIndex;
        const active = i === currentIndex;
        return (
          <View key={step} style={styles.step}>
            <View style={[styles.bar, done && styles.barDone, active && styles.barActive]} />
            <View style={styles.labelRow}>
              {done ? <Ionicons name="checkmark-circle" size={14} color={colors.black} /> : null}
              <Text variant="caption" tone={active || done ? 'default' : 'subtle'} style={active && styles.activeLabel}>
                {step}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.xl, paddingBottom: spacing.md },
  step: { flex: 1, gap: 6 },
  bar: { height: 4, borderRadius: radius.pill, backgroundColor: colors.border },
  barDone: { backgroundColor: colors.black },
  barActive: { backgroundColor: colors.yellow },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  activeLabel: { fontFamily: fonts.bold },
});
