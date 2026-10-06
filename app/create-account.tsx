import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Banner, Button, Input, Screen, ScreenHeader, StickyFooter, Text } from '@/components/ui';
import { spacing } from '@/constants/theme';
import { validateEmail, validateName, validatePhone } from '@/lib/validation';
import { requestCode } from '@/services/auth';
import { useAppStore } from '@/store/app';

/** Guest to account: details are prefilled from the last guest order. */
export default function CreateAccount() {
  const guest = useAppStore((s) => s.guestDetails);
  const [name, setName] = useState(guest?.name ?? '');
  const [phone, setPhone] = useState(guest?.phone ?? '');
  const [email, setEmail] = useState(guest?.email ?? '');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const errors = { name: validateName(name), phone: validatePhone(phone), email: validateEmail(email) };
  const valid = !errors.name && !errors.phone && !errors.email;

  const submit = async () => {
    setSubmitted(true);
    if (!valid) return;
    setLoading(true);
    setError(null);
    try {
      const { sentTo } = await requestCode(phone);
      router.push({
        pathname: '/verify',
        params: { identifier: phone, sentTo, mode: 'create', name, phone, email },
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen
      header={<ScreenHeader backIcon="close" />}
      footer={
        <StickyFooter>
          <Button label="Continue" onPress={submit} loading={loading} />
        </StickyFooter>
      }
    >
      <View style={styles.intro}>
        <Text variant="h1">Save your details</Text>
        <Text variant="body" tone="muted">
          Create a free Kater account to check out faster, track your orders and use meal credits from your employer.
        </Text>
      </View>
      <Input label="Full name" value={name} onChangeText={setName} autoComplete="name" error={submitted ? errors.name : null} />
      <Input
        label="Phone number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        autoComplete="tel"
        hint="We'll text a code to confirm it's you."
        error={submitted ? errors.phone : null}
      />
      <Input
        label="Email address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        error={submitted ? errors.email : null}
      />
      {error ? <Banner tone="error">{error}</Banner> : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { gap: spacing.sm, marginBottom: spacing.sm },
});
