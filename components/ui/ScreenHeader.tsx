import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors, spacing } from '@/constants/theme';
import { Text } from './Text';

export interface ScreenHeaderProps {
  title?: string;
  subtitle?: string;
  /** Show a back button. Defaults to router.back(). */
  back?: boolean | (() => void);
  backIcon?: 'chevron-back' | 'close';
  right?: ReactNode;
}

export function ScreenHeader({ title, subtitle, back = true, backIcon = 'chevron-back', right }: ScreenHeaderProps) {
  const onBack = typeof back === 'function' ? back : () => (router.canGoBack() ? router.back() : router.replace('/'));
  return (
    <View style={styles.wrap}>
      <View style={styles.side}>
        {back ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={backIcon === 'close' ? 'Close' : 'Go back'}
            onPress={onBack}
            hitSlop={8}
            style={({ pressed }) => [styles.backBtn, pressed && { backgroundColor: colors.disabledBg }]}
          >
            <Ionicons name={backIcon} size={24} color={colors.black} />
          </Pressable>
        ) : null}
      </View>
      <View style={styles.center}>
        {title ? (
          <Text variant="h3" numberOfLines={1} align="center" accessibilityRole="header">
            {title}
          </Text>
        ) : null}
        {subtitle ? (
          <Text variant="caption" tone="muted" numberOfLines={1} align="center">
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={[styles.side, styles.right]}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    minHeight: 56,
  },
  side: { width: 72, flexDirection: 'row', alignItems: 'center' },
  right: { justifyContent: 'flex-end', paddingRight: spacing.sm },
  center: { flex: 1, alignItems: 'center' },
  backBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
});
