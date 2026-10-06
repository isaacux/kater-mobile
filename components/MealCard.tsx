import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '@/constants/theme';
import type { DietaryTag, Meal } from '@/data/types';
import { RemoteImage } from './RemoteImage';
import { Button, Card, QuantityStepper, Tag, Text } from './ui';

export interface MealCardProps {
  meal: Meal;
  quantity: number;
  onChangeQuantity: (q: number) => void;
  onOpen: () => void;
}

export function tagTone(tag: DietaryTag) {
  if (tag === 'Spicy') return 'danger' as const;
  if (tag === 'Vegetarian' || tag === 'Vegan') return 'success' as const;
  return 'neutral' as const;
}

export const MealCard = memo(function MealCard({ meal, quantity, onChangeQuantity, onOpen }: MealCardProps) {
  const added = quantity > 0;
  return (
    <Card selected={added}>
      <Pressable
        onPress={onOpen}
        accessibilityRole="button"
        accessibilityLabel={`${meal.name}. View details`}
        style={({ pressed }) => [styles.row, pressed && { opacity: 0.8 }]}
      >
        <RemoteImage uri={meal.image} style={styles.image} />
        <View style={styles.body}>
          <Text variant="bodyStrong" numberOfLines={2}>
            {meal.name}
          </Text>
          <Text variant="small" tone="muted" numberOfLines={2}>
            {meal.description}
          </Text>
          {meal.tags.length > 0 ? (
            <View style={styles.tags}>
              {meal.tags.slice(0, 3).map((t) => (
                <Tag key={t} label={t} tone={tagTone(t)} />
              ))}
            </View>
          ) : null}
        </View>
      </Pressable>
      <View style={styles.actions}>
        {added ? (
          <>
            <Text variant="smallStrong">In your order</Text>
            <QuantityStepper value={quantity} onChange={onChangeQuantity} itemLabel={meal.name} />
          </>
        ) : (
          <>
            <Pressable onPress={onOpen} hitSlop={8} accessibilityRole="button" accessibilityLabel={`Details for ${meal.name}`}>
              <Text variant="small" tone="muted" style={styles.details}>
                View details
              </Text>
            </Pressable>
            <Button label="Add" icon="add" size="sm" onPress={() => onChangeQuantity(1)} style={styles.addBtn} />
          </>
        )}
      </View>
    </Card>
  );
});

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md },
  image: { width: 84, height: 84, borderRadius: radius.md, backgroundColor: colors.yellowSoft },
  body: { flex: 1, gap: 4 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 2 },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    minHeight: 40,
  },
  details: { textDecorationLine: 'underline' },
  addBtn: { minWidth: 96, minHeight: 40 },
});
