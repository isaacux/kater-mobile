import { router } from 'expo-router';
import type { ReactNode } from 'react';

import type { DeliveryLocation, Hub, Vendor } from '@/data/types';
import { useIsSignedIn } from '@/store/app';
import { useDraftContext } from '@/store/draft';
import { Button, EmptyState, Screen } from './ui';

/**
 * Renders the step only when there is an order in progress. If the app was
 * reloaded mid-flow, shows a friendly way back instead of a broken screen.
 */
export function DraftGuard({
  requireLocation,
  children,
}: {
  requireLocation?: boolean;
  children: (ctx: { hub: Hub; vendor: Vendor; location: DeliveryLocation | undefined }) => ReactNode;
}) {
  const { hub, vendor, location } = useDraftContext();
  const signedIn = useIsSignedIn();
  if (!hub || !vendor || (requireLocation && !location)) {
    return (
      <Screen scroll={false} contentStyle={{ justifyContent: 'center' }}>
        <EmptyState
          icon="refresh"
          title="Let's start that order again"
          body="We couldn't find an order in progress. Pick a vendor to start a new one."
          action={
            <Button
              label="Back to vendors"
              onPress={() => router.dismissTo(signedIn ? '/home' : '/hub')}
            />
          }
        />
      </Screen>
    );
  }
  return <>{children({ hub, vendor, location })}</>;
}
