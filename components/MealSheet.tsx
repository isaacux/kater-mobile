import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetTextInput,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { forwardRef, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, radius, spacing } from '@/constants/theme';
import type { Meal } from '@/data/types';
import { formatShortDate } from '@/lib/dates';
import { formatGHS } from '@/lib/format';
import { tagTone } from './MealCard';
import { RemoteImage } from './RemoteImage';
import { Button, QuantityStepper, Tag, Text } from './ui';

export interface MealSheetProps {
  meal: Meal | null;
  date: string | null;
  price: number;
  quantity: number;
  onChangeQuantity: (q: number) => void;
  onClose: () => void;
}

/** Bottom sheet with a larger image, full details and the same quantity control. */
export const MealSheet = forwardRef<BottomSheetModal, MealSheetProps>(function MealSheet(
  { meal, date, price, quantity, onChangeQuantity, onClose },
  ref,
) {
  const insets = useSafeAreaInsets();
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior="close" opacity={0.5} />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={['88%']}
      enableDynamicSizing={false}
      backdropComponent={renderBackdrop}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      handleIndicatorStyle={styles.handle}
      backgroundStyle={styles.sheetBg}
    >
      {meal ? (
        <BottomSheetScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}>
          <RemoteImage key={meal.id} uri={meal.image} style={styles.image} label={meal.name} />
          <View style={styles.section}>
            <Text variant="h1">{meal.name}</Text>
            <Text variant="bodyStrong">{formatGHS(price)}</Text>
            {meal.tags.length > 0 ? (
              <View style={styles.tags}>
                {meal.tags.map((t) => (
                  <Tag key={t} label={t} tone={tagTone(t)} />
                ))}
              </View>
            ) : null}
            <Text variant="body" tone="muted">
              {meal.description}
            </Text>
          </View>

          <View style={styles.qtyCard}>
            <View style={styles.flex}>
              <Text variant="overline" tone="muted">
                Quantity
              </Text>
              <Text variant="bodyStrong">{date ? `For ${formatShortDate(date)}` : ''}</Text>
              {quantity > 0 ? (
                <Text variant="small" tone="muted">
                  {formatGHS(quantity * price)}
                </Text>
              ) : null}
            </View>
            {quantity > 0 ? (
              <QuantityStepper
                value={quantity}
                onChange={onChangeQuantity}
                size="lg"
                InputComponent={BottomSheetTextInput}
                itemLabel={meal.name}
              />
            ) : (
              <Button label="Add" icon="add" onPress={() => onChangeQuantity(1)} style={styles.addBtn} />
            )}
          </View>

          <Button label="Done" variant={quantity > 0 ? 'primary' : 'secondary'} onPress={onClose} />
        </BottomSheetScrollView>
      ) : null}
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  sheetBg: { backgroundColor: colors.white, borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl },
  handle: { backgroundColor: colors.borderStrong, width: 44 },
  content: { paddingHorizontal: spacing.xl, gap: spacing.xl },
  image: { width: '100%', height: 240, borderRadius: radius.lg, backgroundColor: colors.yellowSoft },
  section: { gap: spacing.sm },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  qtyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    backgroundColor: colors.offWhite,
  },
  flex: { flex: 1, gap: 2 },
  addBtn: { minWidth: 120 },
});
