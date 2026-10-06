import { StyleSheet, View } from 'react-native';

import { colors, fonts, radius } from '@/constants/theme';
import { Text } from './ui';

/** Simple Kater wordmark: black tile with a yellow K. */
export function BrandMark({ size = 40, showName = true }: { size?: number; showName?: boolean }) {
  return (
    <View style={styles.row} accessibilityRole="image" accessibilityLabel="Kater Hubs">
      <View style={[styles.tile, { width: size, height: size, borderRadius: size * 0.28 }]}>
        <Text style={[styles.k, { fontSize: size * 0.6, lineHeight: size * 0.75 }]}>K</Text>
      </View>
      {showName ? (
        <Text style={[styles.name, { fontSize: size * 0.5 }]}>
          kater<Text style={[styles.hubs, { fontSize: size * 0.5 }]}> hubs</Text>
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  tile: { backgroundColor: colors.black, alignItems: 'center', justifyContent: 'center', borderRadius: radius.md },
  k: { color: colors.yellow, fontFamily: fonts.extrabold },
  name: { fontFamily: fonts.extrabold, color: colors.black, letterSpacing: -0.5 },
  hubs: { fontFamily: fonts.medium, color: colors.black },
});
