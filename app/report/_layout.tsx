import { Tabs } from "expo-router";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const TAB_BAR_HEIGHT = 65
const TAB_ITEM_SIZE = 30

export default function ReportLayout() {
  return (
    <View style={{flex: 1}}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: "black", // Use this to set the color of the icons
            tabBarLabelStyle: { // Use this to style the labels
              // fontSize: 20,
              fontWeight: 'bold',
            },
            tabBarItemStyle: {
              // This next line centers the icon vertically
              marginTop: -10 + (TAB_BAR_HEIGHT-TAB_ITEM_SIZE)/2, // The -10 aligns the top of the icon/label pair to the top of the tab bar
            },
            tabBarStyle: {
              backgroundColor: "white",
              bottom: 40, // Shifts the tab bar up and down
              position: "absolute", // Shows your screen under the tab bar
              height: TAB_BAR_HEIGHT,
              width: "83%", // The tab bar is 83% of the screen's width
              // This next line centers the tab bar horizontally
              marginLeft: "8.5%", // (100-83)% divided by 2
              borderRadius: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.5,
              shadowRadius: 10,
            },
          }}
        >
        <Tabs.Screen
          name="personality"
          options={{
            title: "Personality",
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="person-outline"
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="couple"
          options={{
            title: "Couple",
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="heart-outline"
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="family"
          options={{
            title: "Family",
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="people-outline"
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="culture"
          options={{
            title: "Culture",
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="earth-outline"
                size={size}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
