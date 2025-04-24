import { Tabs } from "expo-router";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

const TAB_BAR_HEIGHT = 60
const TAB_ITEM_SIZE = 30

export default function HomeLayout() {
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
            padding: 0,
            borderRadius: 16,
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.2,
            shadowRadius: 10,
          },
          // tabBarShowLabel: false,
          tabBarStyle: {
            // paddingTop: 0,
            backgroundColor: "white",
            bottom: 40, // Shifts the tab bar up and down
            position: "absolute", // Shows your screen under the tab bar
            height: TAB_BAR_HEIGHT,
            width: "83%", // The tab bar is 83% of the screen's width
            // This next line centers the tab bar horizontally
            marginLeft: "8.5%", // 17% divided by 2
            borderRadius: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.5,
            shadowRadius: 10,
            // left: 20,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="home-outline"
                size={size}
                color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="person-outline"
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
