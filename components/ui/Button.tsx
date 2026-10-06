import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps, ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, fonts, radius, spacing } from '@/constants/theme';
import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'dark' | 'ghost' | 'danger';
type Size = 'lg' | 'md' | 'sm';

export interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  icon?: ComponentProps<typeof Ionicons>['name'];
  iconRight?: ComponentProps<typeof Ionicons>['name'];
  style?: StyleProp<ViewStyle>;
  accessibilityHint?: string;
  children?: ReactNode;
}

const heights: Record<Size, number> = { lg: 56, md: 48, sm: 36 };

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'lg',
  disabled,
  loading,
  icon,
  iconRight,
  style,
  accessibilityHint,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const palette = isDisabled && variant !== 'ghost' ? disabledPalette : palettes[variant];
  const textColor = isDisabled && variant === 'ghost' ? colors.disabledText : palette.text;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: !!isDisabled, busy: !!loading }}
      disabled={isDisabled}
      onPress={onPress}
      hitSlop={size === 'sm' ? 8 : 0}
      style={({ pressed }) => [
        styles.base,
        {
          minHeight: heights[size],
          backgroundColor: palette.bg,
          borderColor: palette.border,
          paddingHorizontal: size === 'sm' ? spacing.md : spacing.xl,
          opacity: pressed && !isDisabled ? 0.85 : 1,
        },
        variant === 'ghost' && styles.ghost,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={palette.text} />
      ) : (
        <View style={styles.row}>
          {icon ? <Ionicons name={icon} size={size === 'sm' ? 16 : 20} color={textColor} /> : null}
          <Text
            style={[styles.label, { color: textColor, fontSize: size === 'sm' ? 14 : 16 }]}
            numberOfLines={1}
          >
            {label}
          </Text>
          {iconRight ? <Ionicons name={iconRight} size={size === 'sm' ? 16 : 20} color={textColor} /> : null}
        </View>
      )}
    </Pressable>
  );
}

const palettes: Record<Variant, { bg: string; text: string; border: string }> = {
  primary: { bg: colors.yellow, text: colors.black, border: colors.yellow },
  secondary: { bg: colors.white, text: colors.black, border: colors.black },
  dark: { bg: colors.black, text: colors.white, border: colors.black },
  ghost: { bg: 'transparent', text: colors.black, border: 'transparent' },
  danger: { bg: colors.white, text: colors.danger, border: colors.danger },
};

const disabledPalette = { bg: colors.disabledBg, text: colors.disabledText, border: colors.disabledBg };

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghost: { paddingHorizontal: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  label: { fontFamily: fonts.bold },
});
