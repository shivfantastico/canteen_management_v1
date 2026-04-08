/**
 * app/_layout.jsx
 * ─────────────────────────────────────────────────────────────────
 * Expo Router Root Layout — JSX (no TypeScript).
 *
 * ⚠️  RULES FOR EXPO ROUTER:
 *   1. NEVER import or use NavigationContainer — Expo Router adds it.
 *   2. NEVER use useNavigation() from @react-navigation/native.
 *   3. ALWAYS use `router` from 'expo-router' for navigation.
 *   4. Route names = file names: login.jsx → '/login'
 * ─────────────────────────────────────────────────────────────────
 */

import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function RootLayout() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#C0000A" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_left",
          gestureEnabled: false,
          contentStyle: { backgroundColor: "#161616" },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="Signup" />
        <Stack.Screen name="home" />
        <Stack.Screen name="create-order" />
        <Stack.Screen name="edit-order" />
      </Stack>
    </>
  );
}
