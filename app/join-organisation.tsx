import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Banner, Button, Card, Input, Screen, ScreenHeader, StickyFooter, Text } from '@/components/ui';
import { colors, spacing } from '@/constants/theme';
import type { Organisation } from '@/data/types';
import { lookupOrganisation } from '@/services/organisations';
import { useAppStore, useCurrentUser } from '@/store/app';

/** Join with an org Kater ID. Shows the employer name before confirming. */
export default function JoinOrganisation() {
  const user = useCurrentUser();
  const joinOrganisation = useAppStore((s) => s.joinOrganisation);
  const [katerId, setKaterId] = useState('');
  const [found, setFound] = useState<Organisation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const alreadyMember = !!found && !!user?.organisations.some((o) => o.katerId === found.katerId);

  const find = async () => {
    setError(null);
    setFound(null);
    setLoading(true);
    try {
      setFound(await lookupOrganisation(katerId));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const confirm = () => {
    if (!found) return;
    joinOrganisation(found);
    router.back();
  };

  return (
    <Screen
      header={<ScreenHeader title="Join an organisation" backIcon="close" />}
      footer={
        <StickyFooter>
          {found ? (
            <>
              <Button label={`Join ${found.employerName}`} onPress={confirm} disabled={alreadyMember} />
              <Button label="Use a different ID" variant="ghost" onPress={() => setFound(null)} />
            </>
          ) : (
            <Button label="Find organisation" onPress={find} loading={loading} disabled={!katerId.trim()} />
          )}
        </StickyFooter>
      }
    >
      <Text variant="body" tone="muted">
        Enter the organisation Kater ID from your HR or office admin. We’ll show you the employer before you join.
      </Text>
      <Input
        label="Organisation Kater ID"
        placeholder="e.g. KTR-OMA-2026"
        value={katerId}
        onChangeText={(t) => {
          setKaterId(t.toUpperCase());
          setFound(null);
          setError(null);
        }}
        autoCapitalize="characters"
        autoCorrect={false}
        returnKeyType="search"
        onSubmitEditing={find}
        error={error}
        editable={!loading}
      />
      {found ? (
        <Card selected>
          <View style={styles.row}>
            <View style={styles.icon}>
              <Ionicons name="business" size={24} color={colors.black} />
            </View>
            <View style={styles.flex}>
              <Text variant="caption" tone="muted">
                Employer
              </Text>
              <Text variant="h2">{found.employerName}</Text>
              <Text variant="small" tone="muted">
                Kater ID {found.katerId}
              </Text>
            </View>
          </View>
        </Card>
      ) : null}
      {alreadyMember ? <Banner tone="info">{`You’re already a member of ${found?.employerName}.`}</Banner> : null}
      {!found && !error ? (
        <Banner tone="info" title="Demo IDs">
          {'KTR-TOT-1024 · KTR-OMA-2026 · KTR-KAS-3310 · KTR-ACC-0077'}
        </Banner>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  icon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.yellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: { flex: 1, gap: 2 },
});
