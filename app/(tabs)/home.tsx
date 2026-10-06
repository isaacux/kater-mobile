import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BrandMark } from '@/components/BrandMark';
import { HubCodeForm } from '@/components/HubCodeForm';
import { VendorList } from '@/components/VendorList';
import { Screen, Text } from '@/components/ui';
import { spacing } from '@/constants/theme';
import { findHub } from '@/data/hubs';
import { useAppStore, useCurrentUser } from '@/store/app';
import { useDraftStore } from '@/store/draft';

/** Opens straight to the recent hub's vendors, or asks for a hub code. */
export default function Home() {
  const user = useCurrentUser();
  const recentHubCode = useAppStore((s) => s.recentHubCode);
  const startVendor = useDraftStore((s) => s.startVendor);
  const [changing, setChanging] = useState(false);
  const hub = recentHubCode ? findHub(recentHubCode) : undefined;

  return (
    <Screen>
      <View style={styles.top}>
        <BrandMark size={32} />
        <Text variant="small" tone="muted">
          Hi, {user?.name.split(' ')[0]}
        </Text>
      </View>
      {hub && !changing ? (
        <VendorList
          hub={hub}
          onChangeHub={() => setChanging(true)}
          onSelectVendor={(v) => {
            startVendor(hub.code, v.id);
            router.push('/order/location');
          }}
        />
      ) : (
        <HubCodeForm onOpen={() => setChanging(false)} onCancel={hub ? () => setChanging(false) : undefined} />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
});
