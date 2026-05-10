import { useAuthStore } from "@/store/authStore";
import { useIssueStore } from "@/store/issueStore";
import { useThemeStore } from "@/store/themeStore";
import { router } from "expo-router";
import { Alert, Pressable, ScrollView, Switch, Text, View } from "react-native";

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const { issues, syncQueue, lastSynced, fetchIssues } = useIssueStore();
  const isDark = useThemeStore((s) => s.mode === "dark");
  const toggleMode = useThemeStore((s) => s.toggleMode);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          logout();
          router.replace("/login");
        },
      },
    ]);
  };

  const formatLastSynced = () => {
    if (!lastSynced) return "Never";
    return new Date(lastSynced).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <ScrollView
      className={`flex-1 ${isDark ? "bg-gray-950" : "bg-gray-50"}`}
      contentContainerStyle={{ padding: 20, gap: 16 }}
    >
      {/* Avatar + name */}
      <View
        className={`rounded-2xl p-6 items-center border gap-3 ${
          isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
        }`}
      >
        <View className="w-20 h-20 rounded-full bg-blue-500 items-center justify-center">
          <Text className="text-white text-3xl font-bold">
            {user?.name?.charAt(0).toUpperCase() ?? "?"}
          </Text>
        </View>
        <Text className={`text-xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}>
          {user?.name}
        </Text>
        <Text className={`text-sm ${isDark ? "text-gray-400" : "text-gray-400"}`}>
          {user?.email}
        </Text>
      </View>

      {/* Stats */}
      <View
        className={`rounded-2xl p-4 border gap-3 ${
          isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
        }`}
      >
        <Text className={`text-sm font-semibold uppercase ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          My Stats
        </Text>
        <StatRow label="Total Issues" value={issues.length.toString()} isDark={isDark} />
        <StatRow
          label="Open"
          value={issues.filter((i) => i.status === "open").length.toString()}
          isDark={isDark}
        />
        <StatRow
          label="Resolved"
          value={issues
            .filter((i) => i.status === "resolved")
            .length.toString()}
          isDark={isDark}
        />
        <StatRow
          label="Pending Sync"
          value={syncQueue.length.toString()}
          highlight={syncQueue.length > 0}
          isDark={isDark}
        />
        <StatRow label="Last Synced" value={formatLastSynced()} isDark={isDark} />
      </View>

      {/* Actions */}
      <View
        className={`rounded-2xl p-4 border gap-3 ${
          isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
        }`}
      >
        <Text className={`text-sm font-semibold uppercase ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          Actions
        </Text>

        <Pressable
          className="flex-row items-center justify-between py-2"
          onPress={fetchIssues}
        >
          <Text className={`text-base ${isDark ? "text-gray-200" : "text-gray-700"}`}>Sync Now</Text>
          <Text className="text-blue-500 text-sm font-semibold">↻ Sync</Text>
        </Pressable>

        <View className={`h-px ${isDark ? "bg-gray-800" : "bg-gray-100"}`} />

        <Pressable
          className="flex-row items-center justify-between py-2"
          onPress={() => router.push("/issue/create")}
        >
          <Text className={`text-base ${isDark ? "text-gray-200" : "text-gray-700"}`}>Create Issue</Text>
          <Text className="text-blue-500 text-sm font-semibold">+</Text>
        </Pressable>

        <View className={`h-px ${isDark ? "bg-gray-800" : "bg-gray-100"}`} />

        <View className="flex-row items-center justify-between py-2">
          <Text className={`text-base ${isDark ? "text-gray-200" : "text-gray-700"}`}>
            Dark Mode
          </Text>
          <Switch value={isDark} onValueChange={toggleMode} />
        </View>
      </View>

      {/* Logout */}
      <Pressable
        className={`border rounded-2xl p-4 items-center ${
          isDark ? "bg-red-900/20 border-red-800" : "bg-red-50 border-red-200"
        }`}
        onPress={handleLogout}
      >
        <Text className="text-red-500 font-bold text-base">Logout</Text>
      </Pressable>

      {/* App info */}
      <View className="items-center gap-1">
        <Text className={`text-xs ${isDark ? "text-gray-600" : "text-gray-300"}`}>
          Issue Tracker v1.0.0
        </Text>
      </View>
    </ScrollView>
  );
}

function StatRow({
  label,
  value,
  highlight = false,
  isDark = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  isDark?: boolean;
}) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>{label}</Text>
      <Text
        className={`text-sm font-semibold ${
          highlight ? "text-yellow-600" : isDark ? "text-gray-100" : "text-gray-900"
        }`}
      >
        {value}
      </Text>
    </View>
  );
}
