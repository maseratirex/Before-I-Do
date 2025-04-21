import { Stack } from "expo-router";

export default function RootLayout() {

  return (
    <Stack>
      <Stack.Screen
        name="(home)"
        options={{
          title: 'Home',
          headerShown: false,
          headerStyle: {
            backgroundColor: '#77CDFF',
          },
        }}
      />
      <Stack.Screen
        name="auth"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="(assessment)/directory"
        options={{
          headerTransparent: true,
          title: '',
        }}
      />
      <Stack.Screen
        name="(assessment)/section/[name]"
        options={{
          headerTransparent: true,
          title: 'Assessment',
        }}
      />
      <Stack.Screen
        name="report"
        options={{
          headerTransparent: true,
          title: '',
        }}
      />
    </Stack>
  );
}
