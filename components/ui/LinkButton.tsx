import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { colors, fonts } from '@/constants/theme';
import { Text } from './Text';

/** Small inline text action, e.g. "Change hub" or "Edit". Underlined black text for contrast. */
export function LinkButton({
  label,
  onPress,
  icon,
  tone = 'default',
}: {
  label: string;
  onPress: () => void;
  icon?: ComponentProps<typeof Ionicons>['name'];
  tone?: 'default' | 'danger';
}) {
  const color = tone === 'danger' ? colors.danger : colors.black;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={12}
      style={({ pressed }) => [styles.row, { opacity: pressed ? 0.6 : 1 }]}
    >
      {icon ? <Ionicons name={icon} size={16} color={color} /> : null}
      <Text style={[styles.label, { color }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 4, minHeight: 32 },
  label: { fontFamily: fonts.semibold, fontSize: 14, textDecorationLine: 'underline' },
});
