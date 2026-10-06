import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, radius, shadow, spacing } from '@/constants/theme';

export interface CardProps {
  children: ReactNode;
  onPress?: () => void;
  selected?: boolean;
  disabled?: boolean;
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
  accessibilityRole?: 'button' | 'radio' | 'checkbox';
}

export function Card({
  children,
  onPress,
  selected,
  disabled,
  padded = true,
  style,
  accessibilityLabel,
  accessibilityRole = 'button',
}: CardProps) {
  const cardStyle = [
    styles.card,
    padded && styles.padded,
    selected && styles.selected,
    disabled && styles.disabled,
    style,
  ];
  if (!onPress) return <View style={cardStyle}>{children}</View>;
  return (
    <Pressable
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected: !!selected, disabled: !!disabled, checked: accessibilityRole !== 'button' ? !!selected : undefined }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [cardStyle, pressed && !disabled && styles.pressed]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    ...shadow.card,
  },
  padded: { padding: spacing.lg },
  selected: { borderColor: colors.black, borderWidth: 2, backgroundColor: colors.white },
  disabled: { backgroundColor: colors.disabledBg, borderColor: colors.disabledBg, shadowOpacity: 0, elevation: 0 },
  pressed: { opacity: 0.92, transform: [{ scale: 0.995 }] },
});
