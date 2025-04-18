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
          // headerTintColor: '#697073',
          title: '',
        //   tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Stack.Screen
        name="(assessment)/section/[name]"
        options={{
          headerTransparent: true,
          title: 'Assessment',
        //   tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
    </Stack>
  );
}
