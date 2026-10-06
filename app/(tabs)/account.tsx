import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button, Card, Divider, LinkButton, Screen, SectionTitle, Text } from '@/components/ui';
import { colors, fonts, spacing } from '@/constants/theme';
import { confirm } from '@/lib/confirm';
import { initials } from '@/lib/format';
import { useAppStore, useCurrentUser } from '@/store/app';
import { useDraftStore } from '@/store/draft';

export default function Account() {
  const user = useCurrentUser();
  const leaveOrganisation = useAppStore((s) => s.leaveOrganisation);
  const signOut = useAppStore((s) => s.signOut);
  const resetDraft = useDraftStore((s) => s.reset);
  if (!user) return null;

  const confirmLeave = (katerId: string, employerName: string) =>
    confirm({
      title: `Leave ${employerName}?`,
      message: 'You’ll stop seeing this organisation on your account. You can rejoin later with its Kater ID.',
      confirmLabel: 'Leave',
      destructive: true,
      onConfirm: () => leaveOrganisation(katerId),
    });

  const confirmSignOut = () =>
    confirm({
      title: 'Sign out?',
      message: 'You can sign back in any time with your phone number or email.',
      confirmLabel: 'Sign out',
      destructive: true,
      onConfirm: () => {
        resetDraft();
        signOut();
        router.replace('/');
      },
    });

  return (
    <Screen>
      <Text variant="h1" accessibilityRole="header">
        Account
      </Text>

      <Card>
        <View style={styles.profile}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials(user.name)}</Text>
          </View>
          <View style={styles.flex}>
            <Text variant="h2">{user.name}</Text>
            <Text variant="small" tone="muted">
              Kater member
            </Text>
          </View>
        </View>
        <Divider />
        <View style={styles.fields}>
          <Field icon="call-outline" label="Phone" value={user.phone} />
          <Field icon="mail-outline" label="Email" value={user.email} />
        </View>
        <Button
          label="Edit profile"
          variant="secondary"
          size="md"
          icon="create-outline"
          onPress={() => router.push('/profile')}
          style={styles.edit}
        />
      </Card>

      <SectionTitle title="Organisations" />
      <Card padded={false}>
        {user.organisations.length === 0 ? (
          <View style={styles.orgEmpty}>
            <Text variant="body" tone="muted">
              You’re not part of an organisation yet. Join your employer to use meal credits they fund.
            </Text>
          </View>
        ) : (
          user.organisations.map((org, i) => (
            <View key={org.katerId} style={[styles.org, i > 0 && styles.orgBorder]}>
              <View style={styles.orgIcon}>
                <Ionicons name="business" size={20} color={colors.black} />
              </View>
              <View style={styles.flex}>
                <Text variant="bodyStrong">{org.employerName}</Text>
                <Text variant="small" tone="muted">
                  Kater ID {org.katerId}
                </Text>
              </View>
              <LinkButton label="Leave" tone="danger" onPress={() => confirmLeave(org.katerId, org.employerName)} />
            </View>
          ))
        )}
      </Card>
      <Button
        label="Join an organisation"
        variant="secondary"
        icon="add"
        onPress={() => router.push('/join-organisation')}
      />

      <SectionTitle title="Session" />
      <Button label="Sign out" variant="danger" icon="log-out-outline" onPress={confirmSignOut} />
      <Text variant="caption" tone="muted" align="center">
        Kater Hubs prototype v1.0
      </Text>
    </Screen>
  );
}

function Field({ icon, label, value }: { icon: 'call-outline' | 'mail-outline'; label: string; value: string }) {
  return (
    <View style={styles.field}>
      <Ionicons name={icon} size={20} color={colors.textMuted} />
      <View style={styles.flex}>
        <Text variant="caption" tone="muted">
          {label}
        </Text>
        <Text variant="bodyMedium">{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, gap: 2 },
  profile: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.yellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontFamily: fonts.bold, fontSize: 20, color: colors.black },
  fields: { gap: spacing.md },
  field: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  edit: { marginTop: spacing.lg },
  orgEmpty: { padding: spacing.lg },
  org: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  orgBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  orgIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
