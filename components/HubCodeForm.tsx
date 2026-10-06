import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '@/constants/theme';
import { findHub } from '@/data/hubs';
import type { Hub } from '@/data/types';
import { lookupHub } from '@/services/hubs';
import { useAppStore } from '@/store/app';
import { Button, Card, Input, Text } from './ui';

/**
 * Hub code entry. Validates against the (mock) hub service, saves the hub
 * as the device's most recent hub, and offers the recent hub as a shortcut.
 */
export function HubCodeForm({ onOpen, onCancel }: { onOpen: (hub: Hub) => void; onCancel?: () => void }) {
  const recentHubCode = useAppStore((s) => s.recentHubCode);
  const setRecentHub = useAppStore((s) => s.setRecentHub);
  const recentHub = recentHubCode ? findHub(recentHubCode) : undefined;

  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError(null);
    setLoading(true);
    try {
      const hub = await lookupHub(code);
      setRecentHub(hub.code);
      onOpen(hub);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openRecent = () => {
    if (!recentHub) return;
    setRecentHub(recentHub.code);
    onOpen(recentHub);
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.intro}>
        <View style={styles.icon}>
          <Ionicons name="business" size={28} color={colors.black} />
        </View>
        <Text variant="h1">Enter your hub code</Text>
        <Text variant="body" tone="muted">
          Your company’s hub code opens its private canteen. You’ll find it on the office noticeboard or in your
          welcome email.
        </Text>
      </View>

      <Input
        label="Hub code"
        placeholder="e.g. TOTAL24"
        value={code}
        onChangeText={(t) => {
          setCode(t.toUpperCase());
          if (error) setError(null);
        }}
        autoCapitalize="characters"
        autoCorrect={false}
        autoComplete="off"
        returnKeyType="go"
        onSubmitEditing={submit}
        error={error}
        editable={!loading}
        style={styles.codeInput}
      />

      <Button label="Open canteen" onPress={submit} loading={loading} disabled={!code.trim()} iconRight="arrow-forward" />
      {onCancel ? <Button label="Cancel" variant="ghost" onPress={onCancel} /> : null}

      {recentHub ? (
        <View style={styles.recent}>
          <Text variant="overline" tone="muted">
            Recently used on this device
          </Text>
          <Card onPress={openRecent} accessibilityLabel={`Open ${recentHub.companyName}`}>
            <View style={styles.recentRow}>
              <View style={styles.recentIcon}>
                <Ionicons name="time-outline" size={22} color={colors.black} />
              </View>
              <View style={styles.flex}>
                <Text variant="bodyStrong">{recentHub.companyName}</Text>
                <Text variant="small" tone="muted">
                  Hub code {recentHub.code}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.black} />
            </View>
          </Card>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.lg },
  intro: { gap: spacing.sm, marginBottom: spacing.sm },
  icon: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    backgroundColor: colors.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  codeInput: { fontSize: 20, letterSpacing: 2 },
  recent: { gap: spacing.sm, marginTop: spacing.lg },
  recentRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  recentIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: { flex: 1 },
});
