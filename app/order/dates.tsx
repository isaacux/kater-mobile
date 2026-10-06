import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { DraftGuard } from '@/components/DraftGuard';
import { Banner, Button, LinkButton, Screen, ScreenHeader, StepIndicator, StickyFooter, Text } from '@/components/ui';
import { colors, fonts, radius, spacing } from '@/constants/theme';
import { CUTOFF_EXPLANATION, formatDayName, formatMonth, getWorkingWeeks, type CalendarDay } from '@/lib/dates';
import { pluralise } from '@/lib/format';
import { useDraftStore } from '@/store/draft';

export default function SelectDates() {
  const dates = useDraftStore((s) => s.dates);
  const toggleDate = useDraftStore((s) => s.toggleDate);
  const clearDates = useDraftStore((s) => s.clearDates);
  const pruneExpiredDates = useDraftStore((s) => s.pruneExpiredDates);
  const weeks = useMemo(() => getWorkingWeeks(), []);

  useEffect(() => {
    pruneExpiredDates();
  }, [pruneExpiredDates]);

  return (
    <DraftGuard requireLocation>
      {({ vendor, location }) => (
        <Screen
          header={
            <>
              <ScreenHeader title={vendor.name} subtitle={location?.label} />
              <StepIndicator current="Dates" />
            </>
          }
          footer={
            <StickyFooter>
              <View style={styles.footerRow}>
                <Text variant="bodyStrong">
                  {dates.length === 0 ? 'No dates selected' : `${pluralise(dates.length, 'date')} selected`}
                </Text>
                {dates.length > 0 ? <LinkButton label="Clear selection" icon="close-circle-outline" onPress={clearDates} /> : null}
              </View>
              <Button
                label="Continue to meals"
                iconRight="arrow-forward"
                disabled={dates.length === 0}
                onPress={() => router.push('/order/meals')}
              />
            </StickyFooter>
          }
        >
          <View style={styles.intro}>
            <Text variant="h1">Which days?</Text>
            <Text variant="body" tone="muted">
              Pick one or more working days. Delivery is {vendor.deliveryWindow}.
            </Text>
          </View>

          <Banner tone="warning" title="Ordering cutoff">
            {`${CUTOFF_EXPLANATION} Greyed-out days have closed.`}
          </Banner>

          <View style={styles.weekHeader}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((d) => (
              <Text key={d} variant="caption" tone="muted" align="center" style={styles.flex}>
                {d}
              </Text>
            ))}
          </View>

          {weeks.map((week, wi) => (
            <View key={wi} style={styles.week}>
              <Text variant="overline" tone="muted">
                {wi === 0 ? 'This week' : wi === 1 ? 'Next week' : `Week of ${week[0].date.getDate()} ${formatMonth(week[0].date)}`}
              </Text>
              <View style={styles.weekRow}>
                {week.map((day) => (
                  <DayTile
                    key={day.key}
                    day={day}
                    selected={dates.includes(day.key)}
                    onPress={() => toggleDate(day.key)}
                  />
                ))}
              </View>
            </View>
          ))}

          <View style={styles.legend}>
            <Legend swatch={styles.swatchSelected} label="Selected" />
            <Legend swatch={styles.swatchOpen} label="Available" />
            <Legend swatch={styles.swatchClosed} label="Closed" />
          </View>
        </Screen>
      )}
    </DraftGuard>
  );
}

function DayTile({ day, selected, onPress }: { day: CalendarDay; selected: boolean; onPress: () => void }) {
  const disabled = !day.orderable;
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected, disabled }}
      accessibilityLabel={`${formatDayName(day.date)} ${day.date.getDate()} ${formatMonth(day.date)}${
        disabled ? ', ordering closed' : ''
      }`}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.tile,
        selected && styles.tileSelected,
        disabled && styles.tileDisabled,
        pressed && !disabled && { opacity: 0.85 },
      ]}
    >
      <Text style={[styles.tileDate, disabled && styles.textDisabled]}>{day.date.getDate()}</Text>
      <Text variant="caption" style={[styles.tileMonth, disabled && styles.textDisabled]}>
        {formatMonth(day.date)}
      </Text>
      {disabled ? (
        <View style={styles.closed}>
          <Ionicons name="lock-closed" size={10} color={colors.disabledText} />
          <Text variant="caption" style={[styles.textDisabled, styles.closedText]}>
            {day.isToday ? 'Today' : 'Closed'}
          </Text>
        </View>
      ) : selected ? (
        <Ionicons name="checkmark-circle" size={16} color={colors.black} />
      ) : (
        <View style={styles.spacer} />
      )}
    </Pressable>
  );
}

function Legend({ swatch, label }: { swatch: object; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.swatch, swatch]} />
      <Text variant="caption" tone="muted">
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  intro: { gap: spacing.sm },
  flex: { flex: 1 },
  footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: 32 },
  weekHeader: { flexDirection: 'row', gap: spacing.sm, marginBottom: -spacing.sm },
  week: { gap: spacing.sm },
  weekRow: { flexDirection: 'row', gap: spacing.sm },
  tile: {
    flex: 1,
    minHeight: 76,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    gap: 2,
  },
  tileSelected: { backgroundColor: colors.yellow, borderColor: colors.black, borderWidth: 2 },
  tileDisabled: { backgroundColor: colors.disabledBg, borderColor: colors.disabledBg },
  tileDate: { fontFamily: fonts.bold, fontSize: 20, lineHeight: 24, color: colors.text },
  tileMonth: { color: colors.textMuted },
  textDisabled: { color: colors.disabledText },
  closed: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  closedText: { fontSize: 10 },
  spacer: { height: 16 },
  legend: { flexDirection: 'row', gap: spacing.lg, justifyContent: 'center', marginTop: spacing.sm },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  swatch: { width: 14, height: 14, borderRadius: 4, borderWidth: 1.5 },
  swatchSelected: { backgroundColor: colors.yellow, borderColor: colors.black },
  swatchOpen: { backgroundColor: colors.white, borderColor: colors.border },
  swatchClosed: { backgroundColor: colors.disabledBg, borderColor: colors.disabledBg },
});
