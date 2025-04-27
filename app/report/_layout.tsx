import { Tabs } from "expo-router";
import { Platform } from 'react-native';

export default function ReportLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}>
      <Tabs.Screen
        name="personality"
        options={{
          title: "Personality",
        }}
      />
      <Tabs.Screen
        name="couple"
        options={{
          title: "Couple",
        }}
      />
      <Tabs.Screen
        name="family"
        options={{
          title: "Family",
        }}
      />
      <Tabs.Screen
        name="culture"
        options={{
          title: "Culture",
        }}
      />
    </Tabs>
  );
}
