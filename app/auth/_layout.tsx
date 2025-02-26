import { Stack } from "expo-router";

export default function RootLayout() {
  
  return (
    <Stack screenOptions={{
          headerShown: true,
    }}>
      <Stack.Screen
        name="login"
        options={{
          title: '',
          headerStyle: {
            backgroundColor: '#A6FF98',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        //   tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}/>
      <Stack.Screen
        name="createAccount"
        options={{
          title: '',
          headerStyle: {
            backgroundColor: '#A6FF98',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        //   tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}/>
    </Stack>
  );
}
