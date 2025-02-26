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
          headerStyle: {
            backgroundColor: '#77CDFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        //   tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Stack.Screen
        name="auth"
        options={{
            headerShown: false,
        //   title: 'Home',
        //   headerStyle: {
        //     backgroundColor: '#77CDFF',
        //   },
        //   headerTintColor: '#fff',
        //   headerTitleStyle: {
        //     fontWeight: 'bold',
        //   },
        //   tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Stack.Screen
        name="assessment"
        options={{
          title: 'Assessment',
        //   tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
    </Stack>
  );
}
