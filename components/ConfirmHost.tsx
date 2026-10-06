import { Modal, StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '@/constants/theme';
import { useConfirmStore } from '@/lib/confirm';
import { Button, Text } from './ui';

/** In-app confirmation dialog used on web (see lib/confirm.ts). */
export function ConfirmHost() {
  const pending = useConfirmStore((s) => s.pending);
  const close = useConfirmStore((s) => s.close);

  return (
    <Modal visible={!!pending} transparent animationType="fade" onRequestClose={close}>
      <View style={styles.overlay}>
        {pending ? (
          <View style={styles.dialog} accessibilityRole="alert">
            <Text variant="h2">{pending.title}</Text>
            <Text variant="body" tone="muted">
              {pending.message}
            </Text>
            <View style={styles.actions}>
              <Button label="Cancel" variant="secondary" size="md" onPress={close} style={styles.flex} />
              <Button
                label={pending.confirmLabel}
                variant={pending.destructive ? 'danger' : 'primary'}
                size="md"
                onPress={() => {
                  close();
                  pending.onConfirm();
                }}
                style={styles.flex}
              />
            </View>
          </View>
        ) : null}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: colors.overlay, alignItems: 'center', justifyContent: 'center', padding: spacing.xxl },
  dialog: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.xxl,
    gap: spacing.md,
    width: '100%',
    maxWidth: 380,
  },
  actions: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm },
  flex: { flex: 1 },
});
