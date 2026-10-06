import Ionicons from '@expo/vector-icons/Ionicons';
import { useState, type ComponentType } from 'react';
import { Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { MAX_MEAL_QUANTITY } from '@/constants/config';
import { colors, fonts, radius } from '@/constants/theme';

export interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  size?: 'md' | 'lg';
  /** Allows BottomSheetTextInput inside bottom sheets. */
  InputComponent?: ComponentType<TextInputProps>;
  itemLabel?: string;
}

/**
 * Minus, editable number, plus. Typing a number sets it directly;
 * clearing the field or setting zero removes the item when the field loses focus.
 */
export function QuantityStepper({
  value,
  onChange,
  max = MAX_MEAL_QUANTITY,
  size = 'md',
  InputComponent = TextInput,
  itemLabel = 'meal',
}: QuantityStepperProps) {
  // Text being typed; null when not editing, so the field mirrors `value`.
  const [draft, setDraft] = useState<string | null>(null);
  const text = draft ?? String(value);

  const btn = size === 'lg' ? 48 : 40;

  const commitText = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 3);
    setDraft(digits);
    if (digits === '') return; // wait for blur
    onChange(Math.min(max, Number(digits)));
  };

  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={value === 1 ? `Remove ${itemLabel}` : `Decrease ${itemLabel} quantity`}
        onPress={() => {
          setDraft(null);
          onChange(value - 1);
        }}
        hitSlop={6}
        style={({ pressed }) => [
          styles.btn,
          styles.minus,
          { width: btn, height: btn, opacity: pressed ? 0.7 : 1 },
        ]}
      >
        <Ionicons name={value === 1 ? 'trash-outline' : 'remove'} size={size === 'lg' ? 22 : 18} color={colors.black} />
      </Pressable>
      <InputComponent
        value={text}
        onChangeText={commitText}
        onBlur={() => {
          if (draft !== null && (draft === '' || Number(draft) === 0)) onChange(0);
          setDraft(null);
        }}
        keyboardType="number-pad"
        returnKeyType="done"
        maxLength={3}
        selectTextOnFocus
        accessibilityLabel={`${itemLabel} quantity`}
        style={[styles.field, { height: btn, width: size === 'lg' ? 64 : 52, fontSize: size === 'lg' ? 20 : 17 }]}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Increase ${itemLabel} quantity`}
        onPress={() => {
          setDraft(null);
          onChange(value + 1);
        }}
        disabled={value >= max}
        hitSlop={6}
        style={({ pressed }) => [
          styles.btn,
          styles.plus,
          { width: btn, height: btn, opacity: value >= max ? 0.4 : pressed ? 0.7 : 1 },
        ]}
      >
        <Ionicons name="add" size={size === 'lg' ? 24 : 20} color={colors.black} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  btn: { borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  minus: { backgroundColor: colors.white, borderWidth: 1.5, borderColor: colors.black },
  plus: { backgroundColor: colors.yellow },
  field: {
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    borderRadius: radius.sm,
    textAlign: 'center',
    fontFamily: fonts.bold,
    color: colors.text,
    backgroundColor: colors.white,
    paddingVertical: 0,
    paddingHorizontal: 6,
  },
});
