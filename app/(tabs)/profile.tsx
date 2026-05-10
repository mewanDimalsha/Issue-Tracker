import { useAuthStore } from "@/store/authStore";
import { useIssueStore } from "@/store/issueStore";
import { router } from "expo-router";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";

export default function ProfileScreen() {
  const { user, logout } = useAuthStore();
  const { issues, syncQueue, lastSynced, fetchIssues } = useIssueStore();

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
      className="flex-1 bg-gray-50"
      contentContainerStyle={{ padding: 20, gap: 16 }}
    >
      {/* Avatar + name */}
      <View className="bg-white rounded-2xl p-6 items-center border border-gray-100 gap-3">
        <View className="w-20 h-20 rounded-full bg-blue-500 items-center justify-center">
          <Text className="text-white text-3xl font-bold">
            {user?.name?.charAt(0).toUpperCase() ?? "?"}
          </Text>
        </View>
        <Text className="text-xl font-bold text-gray-900">{user?.name}</Text>
        <Text className="text-sm text-gray-400">{user?.email}</Text>
      </View>

      {/* Stats */}
      <View className="bg-white rounded-2xl p-4 border border-gray-100 gap-3">
        <Text className="text-sm font-semibold text-gray-500 uppercase">
          My Stats
        </Text>
        <StatRow label="Total Issues" value={issues.length.toString()} />
        <StatRow
          label="Open"
          value={issues.filter((i) => i.status === "open").length.toString()}
        />
        <StatRow
          label="Resolved"
          value={issues
            .filter((i) => i.status === "resolved")
            .length.toString()}
        />
        <StatRow
          label="Pending Sync"
          value={syncQueue.length.toString()}
          highlight={syncQueue.length > 0}
        />
        <StatRow label="Last Synced" value={formatLastSynced()} />
      </View>

      {/* Actions */}
      <View className="bg-white rounded-2xl p-4 border border-gray-100 gap-3">
        <Text className="text-sm font-semibold text-gray-500 uppercase">
          Actions
        </Text>

        <Pressable
          className="flex-row items-center justify-between py-2"
          onPress={fetchIssues}
        >
          <Text className="text-base text-gray-700">Sync Now</Text>
          <Text className="text-blue-500 text-sm font-semibold">↻ Sync</Text>
        </Pressable>

        <View className="h-px bg-gray-100" />

        <Pressable
          className="flex-row items-center justify-between py-2"
          onPress={() => router.push("/issue/create")}
        >
          <Text className="text-base text-gray-700">Create Issue</Text>
          <Text className="text-blue-500 text-sm font-semibold">+</Text>
        </Pressable>
      </View>

      {/* Logout */}
      <Pressable
        className="bg-red-50 border border-red-200 rounded-2xl p-4 items-center"
        onPress={handleLogout}
      >
        <Text className="text-red-500 font-bold text-base">Logout</Text>
      </Pressable>

      {/* App info */}
      <View className="items-center gap-1">
        <Text className="text-xs text-gray-300">Issue Tracker v1.0.0</Text>
        <Text className="text-xs text-gray-300">
          Demo: mewan@example.com / mewan123
        </Text>
      </View>
    </ScrollView>
  );
}

function StatRow({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-sm text-gray-500">{label}</Text>
      <Text
        className={`text-sm font-semibold ${
          highlight ? "text-yellow-600" : "text-gray-900"
        }`}
      >
        {value}
      </Text>
    </View>
  );
}
