import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{
      headerShown: true,
      title: '',
      headerTransparent: true,
    }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="createAccount" />
    </Stack>
  );
}
