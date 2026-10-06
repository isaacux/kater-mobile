import { Alert, Platform } from 'react-native';

/**
 * Confirmation dialog. Uses the native Alert on iOS and Android, and
 * window.confirm on web (where Alert buttons are not supported).
 */
export function confirm({
  title,
  message,
  confirmLabel,
  destructive,
  onConfirm,
}: {
  title: string;
  message: string;
  confirmLabel: string;
  destructive?: boolean;
  onConfirm: () => void;
}) {
  if (Platform.OS === 'web') {
    if (globalThis.confirm?.(`${title}\n\n${message}`)) onConfirm();
    return;
  }
  Alert.alert(title, message, [
    { text: 'Cancel', style: 'cancel' },
    { text: confirmLabel, style: destructive ? 'destructive' : 'default', onPress: onConfirm },
  ]);
}
