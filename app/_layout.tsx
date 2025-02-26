import { Stack } from "expo-router";

export default function RootLayout() {
  
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Home',
        //   tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          title: 'Login',
        //   tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Stack.Screen
        name="createAccount"
        options={{
          title: 'Sign Up',
        //   tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Stack.Screen
        name="(assessment)"
        options={{
          title: 'Assessment',
        //   tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
    </Stack>
  );
}
