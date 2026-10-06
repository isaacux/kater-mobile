import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Banner, Button, Input, Screen, ScreenHeader, StickyFooter, Text } from '@/components/ui';
import { spacing } from '@/constants/theme';
import { looksLikeEmail } from '@/lib/validation';
import { requestCode, validateIdentifier } from '@/services/auth';

export default function SignIn() {
  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    const problem = validateIdentifier(identifier);
    if (problem) {
      setError(problem);
      return;
    }
    setLoading(true);
    try {
      const { sentTo } = await requestCode(identifier);
      router.push({ pathname: '/verify', params: { identifier: identifier.trim(), sentTo, mode: 'sign-in' } });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen
      header={<ScreenHeader />}
      footer={
        <StickyFooter>
          <Button label="Send code" onPress={submit} loading={loading} disabled={!identifier.trim()} />
        </StickyFooter>
      }
    >
      <View style={styles.intro}>
        <Text variant="h1">Sign in</Text>
        <Text variant="body" tone="muted">
          Enter your phone number or work email. We’ll send you a 6-digit code.
        </Text>
      </View>
      <Input
        label="Phone number or email"
        placeholder="024 123 4567 or you@company.com"
        value={identifier}
        onChangeText={(t) => {
          setIdentifier(t);
          if (error) setError(null);
        }}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="username"
        keyboardType={looksLikeEmail(identifier) ? 'email-address' : 'default'}
        returnKeyType="send"
        onSubmitEditing={submit}
        error={error}
        autoFocus
      />
      <Banner tone="info" title="Demo accounts">
        {'024 123 4567: account with meal credits and order history.\n020 111 2222: account with no credits or employer.\nAny other valid number or email signs in as the demo account.'}
      </Banner>
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { gap: spacing.sm, marginBottom: spacing.sm },
});
