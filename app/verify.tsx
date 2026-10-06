import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { CodeInput } from '@/components/CodeInput';
import { Banner, Button, LinkButton, Screen, ScreenHeader, StickyFooter, Text } from '@/components/ui';
import { spacing } from '@/constants/theme';
import { buildNewUser, requestCode, verifyCode } from '@/services/auth';
import { useAppStore } from '@/store/app';

type Params = {
  identifier: string;
  sentTo: string;
  mode?: 'sign-in' | 'create';
  name?: string;
  phone?: string;
  email?: string;
};

/** Mock 6-digit code screen. Any 6 digits are accepted. */
export default function Verify() {
  const params = useLocalSearchParams<Params>();
  const signIn = useAppStore((s) => s.signIn);
  const createAccount = useAppStore((s) => s.createAccount);

  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);

  const submit = async (value = code) => {
    setError(null);
    setLoading(true);
    try {
      if (params.mode === 'create') {
        await verifyCode(params.identifier, value);
        createAccount(
          buildNewUser({ name: params.name ?? '', phone: params.phone ?? params.identifier, email: params.email ?? '' }),
        );
      } else {
        const user = await verifyCode(params.identifier, value);
        signIn(user);
      }
      // The entry screen redirects signed-in users to Home.
      if (router.canDismiss()) router.dismissAll();
      else router.replace('/home');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'That code did not work. Try again.');
      setLoading(false);
    }
  };

  const onChangeCode = (value: string) => {
    setCode(value);
    if (error) setError(null);
    if (value.length === 6 && !loading) submit(value);
  };

  const resend = async () => {
    setResent(false);
    await requestCode(params.identifier).catch(() => {});
    setResent(true);
  };

  return (
    <Screen
      header={<ScreenHeader />}
      footer={
        <StickyFooter>
          <Button
            label={params.mode === 'create' ? 'Create account' : 'Verify and sign in'}
            onPress={() => submit()}
            loading={loading}
            disabled={code.length !== 6}
          />
        </StickyFooter>
      }
    >
      <View style={styles.intro}>
        <Text variant="h1">Enter your code</Text>
        <Text variant="body" tone="muted">
          We sent a 6-digit code to <Text variant="bodyStrong">{params.sentTo}</Text>.
        </Text>
      </View>
      <CodeInput value={code} onChange={onChangeCode} error={!!error} />
      {error ? <Banner tone="error">{error}</Banner> : null}
      {resent ? <Banner tone="success">A new code is on its way.</Banner> : null}
      <View style={styles.row}>
        <Text variant="small" tone="muted">
          Didn’t get it?
        </Text>
        <LinkButton label="Resend code" onPress={resend} />
      </View>
      <Banner tone="info">Demo: any 6 digits will work.</Banner>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { gap: spacing.sm, marginBottom: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
});
