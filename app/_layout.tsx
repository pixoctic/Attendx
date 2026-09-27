import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      {/* Leaving the Stack empty lets Expo Router auto-detect all your index.tsx files */}
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}