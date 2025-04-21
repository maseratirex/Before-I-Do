import { Tabs } from "expo-router";
import { View, StyleSheet, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";


const TAB_WIDTH = 320;

export default function HomeLayout() {
  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarBackground: () => (
            <View style={styles.tabBarWrapper}>
              <View style={styles.tabBar} />
            </View>
          ),
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "transparent",
            position: "absolute",
            // alignItems: "center",
            height: 90,
            borderTopWidth: 0,
            elevation: 0,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ focused }) => (
              <View style={styles.tabItem}>
                <MaterialIcons
                  name="home"
                  size={36} // Icon size
                  color={focused ? "#007AFF" : "gray"}
                />
                <Text
                  style={[styles.label, { color: focused ? "#007AFF" : "gray" }]}
                  numberOfLines={1}
                >
                  Home
                </Text>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ focused }) => (
              <View style={styles.tabItem}>
                <MaterialIcons
                  name="person"
                  size={36} // Icon size
                  color={focused ? "#007AFF" : "gray"}
                />
                <Text
                  style={[styles.label, { color: focused ? "#007AFF" : "gray" }]}
                  numberOfLines={1}
                >
                  Profile
                </Text>
              </View>
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBarWrapper: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    alignItems: "center",
  },
  tabBar: {
    width: TAB_WIDTH,
    height: 80,
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
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    width: TAB_WIDTH / 2,
  },
  square: {
    width: 36,
    height: 36,
    borderRadius: 6,
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: "#333",
    textAlign: "center",
  },
});
