import { Tabs } from "expo-router";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import TabBarCard from "@/components/TabBarCard";

const TAB_WIDTH = 320;

export default function HomeLayout() {
  return (
    <View style={styles.screen}>
      <Tabs
        // tabBar={(props) => <TabBarCard {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "black", // Use this to set the color of the icons
          // tabBarLabelStyle: { // Use this to style the labels
          //   fontSize: 20,
          // },
          // tabBarBackground: () => (
          //   <View style={styles.tabBarWrapper}>
          //     <View style={styles.tabBar} />
          //   </View>
          // ),
          // tabBarButton: () => (
          // ),
          // tabBarItemStyle: {
            // gap: 20,
            // left: 20,
            // backgroundColor: "red",
            // left: 34.5,
            // justifyContent: "center",
            // borderRadius: 16,
            // borderTopRightRadius: 0,
            // borderBottomRightRadius: 0,
            // // alignItems: "center",
            // shadowColor: "#000",
            // shadowOffset: { width: 0, height: 6 },
            // shadowOpacity: 0.2,
            // shadowRadius: 10,
          // },
          // tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "white",
            bottom: 40, // Shifts the tab bar up and down
            position: "absolute", // Shows your screen under the tab bar
            height: 60,
            marginLeft: 34.5, // Hard code centering
            width: "83%",
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
              <MaterialIcons
                name="home"
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
              <MaterialIcons
                name="person"
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

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  tabBarWrapper: {
    position: "absolute",
    bottom: 0,
    // width: "100%",
    alignItems: "center",
  },
  tabBar: {
    width: TAB_WIDTH,
    height: 500,
    borderRadius: 20,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
});