import { useAuthStore } from "@/store/authStore";
import { Tabs } from "expo-router";
import { BarChart2, CircleUser, ListChecks } from "lucide-react-native";
import { Pressable, Text } from "react-native";

export default function TabLayout() {
  const logout = useAuthStore((s) => s.logout);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#3B82F6",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopColor: "#E5E7EB",
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        headerStyle: {
          backgroundColor: "#ffffff",
        },
        headerTitleStyle: {
          fontWeight: "700",
          fontSize: 18,
          color: "#111827",
        },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <BarChart2 color={color} size={size} />
          ),
          headerRight: () => (
            <Pressable
              onPress={logout}
              className="mr-4 px-3 py-1 bg-red-50 rounded-lg"
            >
              <Text className="text-red-500 text-sm font-semibold">Logout</Text>
            </Pressable>
          ),
        }}
      />

      <Tabs.Screen
        name="issues"
        options={{
          title: "Issues",
          tabBarIcon: ({ color, size }) => (
            <ListChecks color={color} size={size} />
          ),
          headerRight: () => (
            <Pressable
              onPress={logout}
              className="mr-4 px-3 py-1 bg-red-50 rounded-lg"
            >
              <Text className="text-red-500 text-sm font-semibold">Logout</Text>
            </Pressable>
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <CircleUser color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
