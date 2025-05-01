import { Tabs } from "expo-router";

export default function ReportLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
      }}>
      <Tabs.Screen
        name="personality"
        options={{
          title: "Personality Dynamics",
        }}
      />
      <Tabs.Screen
        name="couple"
        options={{
          title: "Couple Dynamics",
        }}
      />
      <Tabs.Screen
        name="family"
        options={{
          title: "Family Dynamics",
        }}
      />
      <Tabs.Screen
        name="culture"
        options={{
          title: "Culture Dynamics",
        }}
      />
    </Tabs>
  );
}
