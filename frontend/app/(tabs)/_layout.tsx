import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#1e1e2d", 
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: 65,
          position: "absolute",
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: "#4ade80", 
        tabBarInactiveTintColor: "#9ca3af", 
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "HomeScreen") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Recordfill") {
            iconName = focused ? "create" : "create-outline";
          } else if (route.name === "ProfileScreen") {
            iconName = focused ? "person" : "person-outline";
          } else {
            iconName = "ellipse";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    />
  );
}
