import { useRef } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { colors, fonts, radius, spacing } from '@/constants/theme';
import { Text } from './ui';

/** Six boxes backed by a single hidden input, so paste and SMS autofill work. */
export function CodeInput({
  value,
  onChange,
  length = 6,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  length?: number;
  error?: boolean;
}) {
  const ref = useRef<TextInput>(null);
  return (
    <Pressable onPress={() => ref.current?.focus()} accessibilityLabel="Verification code" style={styles.wrap}>
      <View style={styles.row}>
        {Array.from({ length }).map((_, i) => {
          const char = value[i] ?? '';
          const isCurrent = i === Math.min(value.length, length - 1);
          return (
            <View
              key={i}
              style={[styles.box, isCurrent && styles.boxCurrent, char && styles.boxFilled, error && styles.boxError]}
            >
              <Text style={styles.char}>{char}</Text>
            </View>
          );
        })}
      </View>
      <TextInput
        ref={ref}
        value={value}
        onChangeText={(t) => onChange(t.replace(/\D/g, '').slice(0, length))}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        maxLength={length}
        autoFocus
        caretHidden
        style={styles.hidden}
        accessibilityLabel="Enter 6-digit code"
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'relative' },
  row: { flexDirection: 'row', gap: spacing.sm, justifyContent: 'space-between' },
  box: {
    flex: 1,
    maxWidth: 56,
    aspectRatio: 0.85,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxCurrent: { borderColor: colors.black, borderWidth: 2 },
  boxFilled: { backgroundColor: colors.yellowSoft, borderColor: colors.black },
  boxError: { borderColor: colors.danger },
  char: { fontFamily: fonts.bold, fontSize: 24 },
  hidden: { position: 'absolute', width: '100%', height: '100%', opacity: 0.01 },
});
