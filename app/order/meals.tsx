import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DateChips } from '@/components/DateChips';
import { DraftGuard } from '@/components/DraftGuard';
import { MealCard } from '@/components/MealCard';
import { MealSheet } from '@/components/MealSheet';
import {
  Banner,
  Button,
  EmptyState,
  LinkButton,
  ScreenHeader,
  StepIndicator,
  StickyFooter,
  Text,
} from '@/components/ui';
import { colors, spacing } from '@/constants/theme';
import type { Meal, Vendor } from '@/data/types';
import { confirm } from '@/lib/confirm';
import { formatShortDate } from '@/lib/dates';
import { formatGHS, pluralise } from '@/lib/format';
import { datesMissingMeals, mealsOnDate, totalMeals } from '@/lib/order';
import { useDraftStore } from '@/store/draft';

export default function SelectMeals() {
  return (
    <DraftGuard requireLocation>{({ vendor }) => <MealsStep vendor={vendor} />}</DraftGuard>
  );
}

function MealsStep({ vendor }: { vendor: Vendor }) {
  const dates = useDraftStore((s) => s.dates);
  const items = useDraftStore((s) => s.items);
  const storedActive = useDraftStore((s) => s.activeDate);
  const setActiveDate = useDraftStore((s) => s.setActiveDate);
  const setQuantity = useDraftStore((s) => s.setQuantity);
  const copyToAllDates = useDraftStore((s) => s.copyToAllDates);

  const activeDate = storedActive && dates.includes(storedActive) ? storedActive : dates[0] ?? null;
  const dayItems = (activeDate && items[activeDate]) || {};

  const sheetRef = useRef<BottomSheetModal>(null);
  const [sheetMeal, setSheetMeal] = useState<Meal | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(null), 3000);
    return () => clearTimeout(t);
  }, [copied]);

  const counts = useMemo(
    () => Object.fromEntries(dates.map((d) => [d, mealsOnDate(items, d)])),
    [dates, items],
  );
  const mealCount = totalMeals(items, dates);
  const total = mealCount * vendor.pricePerMeal;
  const missing = datesMissingMeals(items, dates);
  const canReview = dates.length > 0 && missing.length === 0;

  const openMeal = useCallback((meal: Meal) => {
    setSheetMeal(meal);
    sheetRef.current?.present();
  }, []);

  const copyToAll = () => {
    if (!activeDate) return;
    const others = dates.filter((d) => d !== activeDate);
    const doCopy = () => {
      copyToAllDates(activeDate);
      setCopied(`Copied to ${pluralise(others.length, 'other date')}.`);
    };
    if (others.some((d) => mealsOnDate(items, d) > 0)) {
      confirm({
        title: 'Replace meals on other dates?',
        message: `This will replace the meals on your other ${pluralise(others.length, 'date')} with the meals for ${formatShortDate(activeDate)}.`,
        confirmLabel: 'Replace',
        onConfirm: doCopy,
      });
    } else {
      doCopy();
    }
  };

  if (!activeDate) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScreenHeader title={vendor.name} />
        <EmptyState
          icon="calendar-outline"
          title="Pick your dates first"
          body="Choose at least one delivery date, then add meals."
          action={<Button label="Choose dates" onPress={() => router.back()} />}
        />
      </SafeAreaView>
    );
  }

  const activeCount = counts[activeDate] ?? 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScreenHeader title={vendor.name} subtitle={`${formatGHS(vendor.pricePerMeal)} per meal`} />
      <StepIndicator current="Meals" />
      <DateChips dates={dates} active={activeDate} counts={counts} onSelect={setActiveDate} />

      <View style={styles.dayBar}>
        <View style={styles.flex}>
          <Text variant="h3">{formatShortDate(activeDate)}</Text>
          <Text variant="small" tone="muted">
            {activeCount === 0 ? 'No meals yet' : pluralise(activeCount, 'meal')}
          </Text>
        </View>
        {dates.length > 1 ? (
          activeCount > 0 ? (
            <LinkButton label="Copy to all selected dates" icon="copy-outline" onPress={copyToAll} />
          ) : null
        ) : null}
      </View>
      {copied ? (
        <View style={styles.banner}>
          <Banner tone="success">{copied}</Banner>
        </View>
      ) : null}

      <FlatList
        data={vendor.meals}
        keyExtractor={(m) => m.id}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        renderItem={({ item }) => (
          <MealCard
            meal={item}
            quantity={dayItems[item.id] ?? 0}
            onChangeQuantity={(q) => setQuantity(activeDate, item.id, q)}
            onOpen={() => openMeal(item)}
          />
        )}
        ListEmptyComponent={
          <EmptyState icon="restaurant-outline" title="No meals available" body="This vendor has no meals listed right now." />
        }
      />

      <StickyFooter>
        <View style={styles.footerRow}>
          <View>
            <Text variant="small" tone="muted">
              {pluralise(mealCount, 'meal')} · {pluralise(dates.length, 'date')}
            </Text>
            <Text variant="h2">{formatGHS(total)}</Text>
          </View>
          <Button
            label="Review order"
            iconRight="arrow-forward"
            disabled={!canReview}
            onPress={() => router.push('/order/review')}
            style={styles.reviewBtn}
          />
        </View>
        {!canReview ? (
          <Text variant="small" tone="muted" accessibilityLiveRegion="polite">
            Add at least one meal for {missing.slice(0, 3).map(formatShortDate).join(', ')}
            {missing.length > 3 ? ` and ${missing.length - 3} more` : ''} to continue.
          </Text>
        ) : null}
      </StickyFooter>

      <MealSheet
        ref={sheetRef}
        meal={sheetMeal}
        date={activeDate}
        price={vendor.pricePerMeal}
        quantity={sheetMeal ? dayItems[sheetMeal.id] ?? 0 : 0}
        onChangeQuantity={(q) => sheetMeal && setQuantity(activeDate, sheetMeal.id, q)}
        onClose={() => sheetRef.current?.dismiss()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.offWhite },
  flex: { flex: 1 },
  dayBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.sm,
  },
  banner: { paddingHorizontal: spacing.xl, paddingBottom: spacing.sm },
  list: { padding: spacing.xl, paddingTop: spacing.sm, gap: spacing.md },
  footerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.md },
  reviewBtn: { flexShrink: 1 },
});
