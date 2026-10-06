import Ionicons from '@expo/vector-icons/Ionicons';
import { Image, type ImageStyle } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, View, type StyleProp } from 'react-native';

import { colors } from '@/constants/theme';
import { Text } from './ui';

/**
 * Remote image with a branded fallback, so cards still look intentional
 * when an image fails to load (offline, slow network).
 */
export function RemoteImage({
  uri,
  style,
  label,
  dark,
}: {
  uri: string;
  style: StyleProp<ImageStyle>;
  label?: string;
  dark?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    const fg = dark ? colors.yellow : colors.black;
    return (
      <View style={[style as object, styles.fallback, { backgroundColor: dark ? colors.black : colors.yellowSoft }]}>
        <Ionicons name="restaurant" size={24} color={fg} />
        {label ? (
          <Text variant="caption" style={[styles.label, { color: fg }]} numberOfLines={2} align="center">
            {label}
          </Text>
        ) : null}
      </View>
    );
  }
  return (
    <Image
      source={uri}
      style={style}
      contentFit="cover"
      transition={150}
      onError={() => setFailed(true)}
      accessibilityIgnoresInvertColors
    />
  );
}

const styles = StyleSheet.create({
  fallback: { alignItems: 'center', justifyContent: 'center', gap: 4, padding: 8, overflow: 'hidden' },
  label: { maxWidth: '90%' },
});
