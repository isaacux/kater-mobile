import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { colors, fonts, radius, spacing } from '@/constants/theme';
import { formatDayName, formatMonth, fromDateKey } from '@/lib/dates';
import { Text } from './ui';

/** Horizontal row of selected dates. Each chip shows how many meals are added. */
export function DateChips({
  dates,
  active,
  counts,
  onSelect,
}: {
  dates: string[];
  active: string | null;
  counts: Record<string, number>;
  onSelect: (date: string) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.row}
      accessibilityRole="tablist"
    >
      {dates.map((key) => {
        const d = fromDateKey(key);
        const isActive = key === active;
        const count = counts[key] ?? 0;
        return (
          <Pressable
            key={key}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={`${formatDayName(d)} ${d.getDate()} ${formatMonth(d)}, ${count} meals`}
            onPress={() => onSelect(key)}
            style={({ pressed }) => [styles.chip, isActive && styles.chipActive, pressed && { opacity: 0.85 }]}
          >
            <Text variant="caption" style={[styles.day, isActive && styles.textActive]}>
              {formatDayName(d)}
            </Text>
            <Text style={[styles.date, isActive && styles.textActive]}>{d.getDate()}</Text>
            <Text variant="caption" style={[styles.day, isActive && styles.textActive]}>
              {formatMonth(d)}
            </Text>
            <View style={[styles.badge, count === 0 ? styles.badgeEmpty : styles.badgeFilled]}>
              <Text variant="caption" style={count === 0 ? styles.badgeEmptyText : styles.badgeText}>
                {count}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 0, flexShrink: 0 },
  row: { paddingHorizontal: spacing.xl, paddingTop: 8, paddingBottom: spacing.md, gap: spacing.sm },
  chip: {
    width: 64,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
  },
  chipActive: { backgroundColor: colors.yellow, borderColor: colors.black, borderWidth: 2 },
  day: { color: colors.textMuted },
  date: { fontFamily: fonts.bold, fontSize: 20, lineHeight: 26, color: colors.text },
  textActive: { color: colors.black },
  badge: {
    position: 'absolute',
    top: -8,
    right: -6,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.offWhite,
  },
  badgeFilled: { backgroundColor: colors.black },
  badgeEmpty: { backgroundColor: colors.disabledBg },
  badgeText: { color: colors.white, fontFamily: fonts.bold },
  badgeEmptyText: { color: colors.textMuted, fontFamily: fonts.bold },
});
