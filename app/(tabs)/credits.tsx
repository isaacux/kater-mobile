import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button, Card, EmptyState, Screen, SectionTitle, Text } from '@/components/ui';
import { colors, fonts, radius, spacing } from '@/constants/theme';
import { formatTimestamp } from '@/lib/dates';
import { formatGHS } from '@/lib/format';
import { useCreditActivity, useCurrentUser } from '@/store/app';

export default function MealCredits() {
  const user = useCurrentUser();
  const activity = useCreditActivity();
  if (!user) return null;

  const funded = !!user.creditFunder;

  return (
    <Screen>
      <Text variant="h1" accessibilityRole="header">
        Meal credits
      </Text>

      {!funded ? (
        <Card>
          <EmptyState
            icon="wallet-outline"
            title="No meal credits yet"
            body="Meal credits are funded by your employer. If your company offers lunch support, ask HR to add you, then join your organisation with its Kater ID. You can still pay directly with Mobile Money or card."
            action={
              <Button label="Join an organisation" variant="secondary" onPress={() => router.push('/join-organisation')} />
            }
          />
        </Card>
      ) : (
        <>
          <View style={styles.balanceCard} accessibilityLabel={`Balance ${formatGHS(user.mealCreditBalance)}`}>
            <Text variant="overline" style={styles.onYellow}>
              Available balance
            </Text>
            <Text style={styles.balance}>{formatGHS(user.mealCreditBalance)}</Text>
            <View style={styles.funder}>
              <Ionicons name="business" size={16} color={colors.black} />
              <Text variant="smallStrong" style={styles.onYellow}>
                Funded by {user.creditFunder}
              </Text>
            </View>
          </View>

          {user.creditInstructions ? (
            <Card>
              <View style={styles.instr}>
                <Ionicons name="information-circle-outline" size={22} color={colors.black} />
                <View style={styles.flex}>
                  <Text variant="bodyStrong">How your credits work</Text>
                  <Text variant="body" tone="muted">
                    {user.creditInstructions}
                  </Text>
                </View>
              </View>
            </Card>
          ) : null}

          {user.mealCreditBalance === 0 ? (
            <Card>
              <Text variant="body" tone="muted">
                You’ve used all your credits for now. You can still order and pay directly with Mobile Money or card.
              </Text>
            </Card>
          ) : null}
        </>
      )}

      <SectionTitle title="Recent activity" />
      {activity.length === 0 ? (
        <Card>
          <Text variant="body" tone="muted" align="center">
            No credit activity yet.
          </Text>
        </Card>
      ) : (
        <Card padded={false}>
          {activity.map((a, i) => (
            <View key={a.id} style={[styles.activity, i > 0 && styles.activityBorder]}>
              <View style={[styles.activityIcon, a.amount > 0 && styles.activityIconIn]}>
                <Ionicons name={a.amount > 0 ? 'arrow-down' : 'restaurant-outline'} size={18} color={colors.black} />
              </View>
              <View style={styles.flex}>
                <Text variant="bodyMedium" numberOfLines={2}>
                  {a.description}
                </Text>
                <Text variant="caption" tone="muted">
                  {a.detail ? `${a.detail} · ` : ''}
                  {formatTimestamp(a.date)}
                </Text>
              </View>
              <Text variant="bodyStrong" tone={a.amount > 0 ? 'success' : 'default'}>
                {a.amount > 0 ? '+' : '−'} {formatGHS(Math.abs(a.amount))}
              </Text>
            </View>
          ))}
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, gap: 2 },
  balanceCard: { backgroundColor: colors.yellow, borderRadius: radius.xl, padding: spacing.xxl, gap: spacing.sm },
  onYellow: { color: colors.black },
  balance: { fontFamily: fonts.extrabold, fontSize: 44, lineHeight: 52, color: colors.black, letterSpacing: -1 },
  funder: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  instr: { flexDirection: 'row', gap: spacing.md },
  activity: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.lg },
  activityBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityIconIn: { backgroundColor: colors.successSoft },
});
