import Ionicons from '@expo/vector-icons/Ionicons';
import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';
import type { ComponentProps } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, fonts, radius } from '@/constants/theme';
import { useIsSignedIn } from '@/store/app';

type IconName = ComponentProps<typeof Ionicons>['name'];

function TabIcon({ name, focused }: { name: IconName; focused: boolean }) {
  return (
    <View style={[styles.icon, focused && styles.iconFocused]}>
      <Ionicons name={focused ? name : (`${name}-outline` as IconName)} size={22} color={colors.black} />
    </View>
  );
}

export default function TabsLayout() {
  const signedIn = useIsSignedIn();
  if (!signedIn) return <Redirect href="/" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.black,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: styles.label,
        tabBarStyle: styles.bar,
        sceneStyle: { backgroundColor: colors.offWhite },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{ title: 'Home', tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} /> }}
      />
      <Tabs.Screen
        name="orders"
        options={{ title: 'Orders', tabBarIcon: ({ focused }) => <TabIcon name="receipt" focused={focused} /> }}
      />
      <Tabs.Screen
        name="credits"
        options={{ title: 'Meal Credits', tabBarIcon: ({ focused }) => <TabIcon name="wallet" focused={focused} /> }}
      />
      <Tabs.Screen
        name="account"
        options={{ title: 'Account', tabBarIcon: ({ focused }) => <TabIcon name="person" focused={focused} /> }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  bar: { backgroundColor: colors.white, borderTopColor: colors.border },
  label: { fontFamily: fonts.semibold, fontSize: 11 },
  icon: { width: 48, height: 26, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  iconFocused: { backgroundColor: colors.yellow },
});
