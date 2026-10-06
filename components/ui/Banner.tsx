import Ionicons from '@expo/vector-icons/Ionicons';
import { isValidElement, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '@/constants/theme';
import { Text } from './Text';

type Tone = 'error' | 'warning' | 'info' | 'success';

const tones = {
  error: { bg: colors.dangerSoft, fg: colors.danger, icon: 'alert-circle' as const },
  warning: { bg: colors.yellowSoft, fg: colors.black, icon: 'warning' as const },
  info: { bg: colors.infoSoft, fg: colors.info, icon: 'information-circle' as const },
  success: { bg: colors.successSoft, fg: colors.success, icon: 'checkmark-circle' as const },
};

export function Banner({ tone = 'info', title, children }: { tone?: Tone; title?: string; children?: ReactNode }) {
  const t = tones[tone];
  return (
    <View style={[styles.wrap, { backgroundColor: t.bg }]} accessibilityRole={tone === 'error' ? 'alert' : undefined}>
      <Ionicons name={t.icon} size={20} color={t.fg} style={styles.icon} />
      <View style={styles.body}>
        {title ? (
          <Text variant="smallStrong" style={{ color: t.fg }}>
            {title}
          </Text>
        ) : null}
        {children == null || isValidElement(children) ? (
          children
        ) : (
          <Text variant="small" style={{ color: tone === 'warning' ? colors.text : t.fg }}>
            {children}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', gap: spacing.md, padding: spacing.md, borderRadius: radius.md },
  icon: { marginTop: 1 },
  body: { flex: 1, gap: 2 },
});
