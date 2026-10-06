import { router, useLocalSearchParams } from 'expo-router';

import { VendorList } from '@/components/VendorList';
import { Button, EmptyState, Screen, ScreenHeader } from '@/components/ui';
import { findHub } from '@/data/hubs';
import { useAppStore } from '@/store/app';
import { useDraftStore } from '@/store/draft';

/** Guest mode: the company's vendor list. */
export default function GuestVendors() {
  const { code } = useLocalSearchParams<{ code?: string }>();
  const recentHubCode = useAppStore((s) => s.recentHubCode);
  const startVendor = useDraftStore((s) => s.startVendor);
  const hub = findHub(code ?? recentHubCode ?? '');

  const changeHub = () => (router.canGoBack() ? router.back() : router.replace('/hub'));

  return (
    <Screen header={<ScreenHeader subtitle="Ordering as a guest" />}>
      {hub ? (
        <VendorList
          hub={hub}
          onChangeHub={changeHub}
          onSelectVendor={(v) => {
            startVendor(hub.code, v.id);
            router.push('/order/location');
          }}
        />
      ) : (
        <EmptyState
          icon="business-outline"
          title="No hub selected"
          body="Enter your company's hub code to see its vendors."
          action={<Button label="Enter hub code" onPress={() => router.replace('/hub')} />}
        />
      )}
    </Screen>
  );
}
