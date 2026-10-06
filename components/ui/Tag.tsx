import { StyleSheet, View } from 'react-native';

import { colors, radius } from '@/constants/theme';
import { Text } from './Text';

type Tone = 'neutral' | 'yellow' | 'success' | 'danger' | 'info' | 'dark';

const tones: Record<Tone, { bg: string; fg: string }> = {
  neutral: { bg: colors.offWhite, fg: colors.text },
  yellow: { bg: colors.yellowSoft, fg: colors.black },
  success: { bg: colors.successSoft, fg: colors.success },
  danger: { bg: colors.dangerSoft, fg: colors.danger },
  info: { bg: colors.infoSoft, fg: colors.info },
  dark: { bg: colors.black, fg: colors.white },
};

export function Tag({ label, tone = 'neutral' }: { label: string; tone?: Tone }) {
  const t = tones[tone];
  return (
    <View style={[styles.tag, { backgroundColor: t.bg }]}>
      <Text variant="caption" style={{ color: t.fg }}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.pill, alignSelf: 'flex-start' },
});
