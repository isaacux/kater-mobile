import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, Input, Screen, ScreenHeader, StickyFooter, Text } from '@/components/ui';
import { spacing } from '@/constants/theme';
import { formatGhanaPhone } from '@/lib/format';
import { validateEmail, validateName, validatePhone } from '@/lib/validation';
import { useAppStore, useCurrentUser } from '@/store/app';

export default function EditProfile() {
  const user = useCurrentUser();
  const updateProfile = useAppStore((s) => s.updateProfile);
  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [submitted, setSubmitted] = useState(false);

  const errors = { name: validateName(name), phone: validatePhone(phone), email: validateEmail(email) };
  const valid = !errors.name && !errors.phone && !errors.email;
  const changed = !!user && (name !== user.name || phone !== user.phone || email !== user.email);

  const save = () => {
    setSubmitted(true);
    if (!valid) return;
    updateProfile({ name: name.trim(), phone: formatGhanaPhone(phone), email: email.trim() });
    router.back();
  };

  return (
    <Screen
      header={<ScreenHeader title="Edit profile" backIcon="close" />}
      footer={
        <StickyFooter>
          <Button label="Save changes" onPress={save} disabled={!changed} />
        </StickyFooter>
      }
    >
      <View style={styles.intro}>
        <Text variant="body" tone="muted">
          These details are used for delivery updates and receipts.
        </Text>
      </View>
      <Input label="Full name" value={name} onChangeText={setName} autoComplete="name" error={submitted ? errors.name : null} />
      <Input
        label="Phone number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        autoComplete="tel"
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
    </Screen>
  );
}

const styles = StyleSheet.create({ intro: { marginBottom: spacing.xs } });
