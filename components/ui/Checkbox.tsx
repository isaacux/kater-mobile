import Ionicons from '@expo/vector-icons/Ionicons';
import { isValidElement, type ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '@/constants/theme';
import { Text } from './Text';

export function Checkbox({
  checked,
  onChange,
  label,
  description,
  disabled,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  description?: ReactNode;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      accessibilityLabel={label}
      disabled={disabled}
      onPress={() => onChange(!checked)}
      style={({ pressed }) => [styles.row, pressed && { opacity: 0.8 }]}
    >
      <View style={[styles.box, checked && styles.boxChecked, disabled && styles.boxDisabled]}>
        {checked ? <Ionicons name="checkmark" size={18} color={colors.black} /> : null}
      </View>
      <View style={styles.text}>
        <Text variant="bodyStrong" tone={disabled ? 'disabled' : 'default'}>
          {label}
        </Text>
        {description == null || isValidElement(description) ? (
          description
        ) : (
          <Text variant="small" tone="muted">
            {description}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

/** Radio dot used inside selectable cards. */
export function RadioDot({ selected, disabled }: { selected: boolean; disabled?: boolean }) {
  return (
    <View style={[styles.radio, selected && styles.radioSelected, disabled && styles.boxDisabled]}>
      {selected ? <View style={styles.radioInner} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.md, alignItems: 'flex-start', minHeight: 48, paddingVertical: 4 },
  box: {
    width: 26,
    height: 26,
    borderRadius: radius.sm - 2,
    borderWidth: 2,
    borderColor: colors.black,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    marginTop: 1,
  },
  boxChecked: { backgroundColor: colors.yellow, borderColor: colors.black },
  boxDisabled: { borderColor: colors.disabledText, backgroundColor: colors.disabledBg },
  text: { flex: 1, gap: 2 },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  radioSelected: { borderColor: colors.black, backgroundColor: colors.yellow },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.black },
});
