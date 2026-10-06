import type { ReactNode } from 'react';
import { ActivityIndicator, Modal, StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '@/constants/theme';
import { Text } from './Text';

export function Divider({ spacing: space = spacing.md }: { spacing?: number }) {
  return <View style={{ height: 1, backgroundColor: colors.border, marginVertical: space }} />;
}

/** Label on the left, value on the right. */
export function InfoRow({
  label,
  value,
  strong,
  right,
}: {
  label: string;
  value?: string;
  strong?: boolean;
  right?: ReactNode;
}) {
  return (
    <View style={styles.infoRow}>
      <Text variant={strong ? 'bodyStrong' : 'body'} tone={strong ? 'default' : 'muted'} style={styles.infoLabel}>
        {label}
      </Text>
      {right ?? (
        <Text variant={strong ? 'h3' : 'bodyMedium'} align="right">
          {value}
        </Text>
      )}
    </View>
  );
}

export function SectionTitle({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text variant="overline" tone="muted">
        {title}
      </Text>
      {action}
    </View>
  );
}

export function LoadingView({ label = 'Loading…' }: { label?: string }) {
  return (
    <View style={styles.loading} accessibilityRole="progressbar" accessibilityLabel={label}>
      <ActivityIndicator size="large" color={colors.black} />
      <Text variant="body" tone="muted">
        {label}
      </Text>
    </View>
  );
}

/** Full-screen blocking state while a mock payment is processed. */
export function ProcessingOverlay({ visible, title, body }: { visible: boolean; title: string; body?: string }) {
  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <View style={styles.overlay}>
        <View style={styles.dialog} accessibilityRole="progressbar" accessibilityLabel={title}>
          <View style={styles.spinnerWrap}>
            <ActivityIndicator size="large" color={colors.black} />
          </View>
          <Text variant="h2" align="center">
            {title}
          </Text>
          {body ? (
            <Text variant="body" tone="muted" align="center">
              {body}
            </Text>
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.md, minHeight: 28 },
  infoLabel: { flexShrink: 1 },
  section: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.sm },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md, padding: spacing.xxl },
  overlay: { flex: 1, backgroundColor: colors.overlay, alignItems: 'center', justifyContent: 'center', padding: spacing.xxl },
  dialog: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.xxl,
    gap: spacing.md,
    alignItems: 'center',
    width: '100%',
    maxWidth: 360,
  },
  spinnerWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
});
