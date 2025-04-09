import { Tabs } from "expo-router";
import { Platform, StyleSheet, View  } from 'react-native';
import Icon from "react-native-vector-icons/MaterialIcons"; 
import { LinearGradient } from "expo-linear-gradient";

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 50,
    marginLeft: "10%",
    width: "80%", 
    height: 70, 
    borderRadius: 16,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  tabBarItemStyle: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    flexDirection: "column",
    paddingBottom: 5,
  },
  tabBarIconStyle: {
    marginBottom: 2,
  },
});

export default function HomeLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarItemStyle: styles.tabBarItemStyle,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <Icon name="home" size={40} color={color} style={styles.tabBarIconStyle} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color }) => (
              <Icon name="person" size={40} color={color} style={styles.tabBarIconStyle} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}
