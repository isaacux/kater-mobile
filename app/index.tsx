import { Redirect, router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BrandMark } from '@/components/BrandMark';
import { Button, Text } from '@/components/ui';
import { colors, radius, spacing } from '@/constants/theme';
import { useIsSignedIn } from '@/store/app';

/** Entry: Sign in (primary) or Order as a guest (secondary). */
export default function Welcome() {
  const signedIn = useIsSignedIn();
  if (signedIn) return <Redirect href="/home" />;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.hero}>
        <BrandMark size={44} />
        <View style={styles.heroText}>
          <Text variant="display">Lunch at work, sorted.</Text>
          <Text variant="body" style={styles.lead}>
            Your company’s private online canteen. Enter your hub code, pick a vendor and order lunch for the days you
            need.
          </Text>
        </View>
        <View style={styles.points}>
          {['Trusted local vendors, one price per meal', 'Order for one day or the whole week', 'Delivered to your floor or branch'].map(
            (p) => (
              <View key={p} style={styles.point}>
                <View style={styles.dot} />
                <Text variant="bodyMedium">{p}</Text>
              </View>
            ),
          )}
        </View>
      </View>

      <View style={styles.actions}>
        <Button label="Sign in" onPress={() => router.push('/sign-in')} />
        <Button label="Order as a guest" variant="secondary" onPress={() => router.push('/hub')} />
        <Text variant="caption" tone="muted" align="center">
          Prototype · no real payments are taken
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.offWhite },
  hero: {
    flex: 1,
    backgroundColor: colors.yellow,
    margin: spacing.lg,
    borderRadius: radius.xl,
    padding: spacing.xxl,
    justifyContent: 'space-between',
  },
  heroText: { gap: spacing.md },
  lead: { color: colors.black },
  points: { gap: spacing.md },
  point: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.black },
  actions: { paddingHorizontal: spacing.xl, paddingBottom: spacing.lg, gap: spacing.md },
});
