import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, spacing } from '@/constants/theme';
import type { OrderDay } from '@/data/types';
import { formatLongDate } from '@/lib/dates';
import { formatGHS, pluralise } from '@/lib/format';
import { Card, Input, LinkButton, Text } from './ui';

/**
 * One date of an order: meals, quantities and subtotal.
 * Pass onChangeNote to make the delivery note editable (review step).
 */
export function OrderDayCard({
  day,
  onEdit,
  onChangeNote,
}: {
  day: OrderDay;
  onEdit?: () => void;
  onChangeNote?: (note: string) => void;
}) {
  const [noteOpen, setNoteOpen] = useState(!!day.note);
  const mealCount = day.items.reduce((n, li) => n + li.quantity, 0);

  return (
    <Card>
      <View style={styles.header}>
        <View style={styles.flex}>
          <Text variant="h3">{formatLongDate(day.date)}</Text>
          <Text variant="small" tone="muted">
            {pluralise(mealCount, 'meal')}
          </Text>
        </View>
        {onEdit ? <LinkButton label="Edit" icon="create-outline" onPress={onEdit} /> : null}
      </View>

      <View style={styles.items}>
        {day.items.map((li) => (
          <View key={li.mealId} style={styles.item}>
            <Text variant="bodyStrong" style={styles.qty}>
              {li.quantity}×
            </Text>
            <Text variant="body" style={styles.flex}>
              {li.mealName}
            </Text>
            <Text variant="bodyMedium">{formatGHS(li.quantity * li.unitPrice)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.subtotal}>
        <Text variant="smallStrong" tone="muted">
          Subtotal
        </Text>
        <Text variant="bodyStrong">{formatGHS(day.subtotal)}</Text>
      </View>

      {onChangeNote ? (
        noteOpen ? (
          <View style={styles.note}>
            <Input
              label="Delivery note"
              placeholder="e.g. Jollof is for Kojo in Finance"
              value={day.note}
              onChangeText={onChangeNote}
              multiline
              maxLength={200}
              hint="Helps the vendor label meals ordered for colleagues."
              style={styles.noteInput}
            />
          </View>
        ) : (
          <View style={styles.note}>
            <LinkButton label="Add a delivery note" icon="add-circle-outline" onPress={() => setNoteOpen(true)} />
          </View>
        )
      ) : day.note ? (
        <View style={styles.noteView}>
          <Text variant="overline" tone="muted">
            Delivery note
          </Text>
          <Text variant="body">{day.note}</Text>
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  flex: { flex: 1 },
  items: { gap: spacing.sm, marginTop: spacing.md },
  item: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  qty: { minWidth: 28 },
  subtotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  note: { marginTop: spacing.md },
  noteInput: { minHeight: 64, textAlignVertical: 'top' },
  noteView: { marginTop: spacing.md, padding: spacing.md, backgroundColor: colors.offWhite, borderRadius: 10, gap: 2 },
});
