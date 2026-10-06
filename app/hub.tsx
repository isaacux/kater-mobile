import { router } from 'expo-router';

import { HubCodeForm } from '@/components/HubCodeForm';
import { Screen, ScreenHeader } from '@/components/ui';

/** Guest mode: enter a hub code to open a company's canteen. */
export default function GuestHub() {
  return (
    <Screen header={<ScreenHeader subtitle="Ordering as a guest" />}>
      <HubCodeForm onOpen={(hub) => router.push({ pathname: '/vendors', params: { code: hub.code } })} />
    </Screen>
  );
}
