// FoodFootprint - Root Layout

import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from '@/contexts/AppContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="processing" />
          <Stack.Screen name="results" />
        </Stack>
      </AppProvider>
    </SafeAreaProvider>
  );
}
