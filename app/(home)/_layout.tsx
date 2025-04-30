import { Tabs } from "expo-router";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const TAB_BAR_HEIGHT = 75
const TAB_ITEM_SIZE = 30
const TAB_ICON_SIZE = 30

export default function HomeLayout() {
  return (
    <View style={{flex: 1}}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "black", // Use this to set the color of the icons
          tabBarIconStyle: {
            
          },
          tabBarLabelStyle: { // Use this to style the labels
            fontSize: 12,
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
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 2, // Density of shadow
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <Ionicons
                name="home-outline"
                size={TAB_ICON_SIZE}
                color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => (
              <Ionicons
                name="person-outline"
                size={TAB_ICON_SIZE}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
