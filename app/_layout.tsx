// import { Tabs } from "expo-router";
import { Stack } from "expo-router";
// import { Platform } from 'react-native';

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
          headerTintColor: '#697073',
          title: '',
        //   tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Stack.Screen
        name="(assessment)/assessment2"
        options={{
          title: 'Assessment',
          headerStyle: {
            backgroundColor: '#F4B9EE',
          },
        //   tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
    </Stack>
  );
}
