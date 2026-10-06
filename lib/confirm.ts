import { Alert, Platform } from 'react-native';
import { create } from 'zustand';

export interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel: string;
  destructive?: boolean;
  onConfirm: () => void;
}

/** Pending web confirmation, rendered by <ConfirmHost />. */
export const useConfirmStore = create<{ pending: ConfirmOptions | null; close: () => void }>()((set) => ({
  pending: null,
  close: () => set({ pending: null }),
}));

/**
 * Confirmation dialog. Uses the native Alert on iOS and Android. On web,
 * where Alert buttons and window.confirm are not reliable, it shows an
 * in-app dialog instead.
 */
export function confirm(options: ConfirmOptions) {
  if (Platform.OS === 'web') {
    useConfirmStore.setState({ pending: options });
    return;
  }
  Alert.alert(options.title, options.message, [
    { text: 'Cancel', style: 'cancel' },
    { text: options.confirmLabel, style: options.destructive ? 'destructive' : 'default', onPress: options.onConfirm },
  ]);
}
