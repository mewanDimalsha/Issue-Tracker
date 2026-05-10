import PriorityBadge from "@/components/priorityBadge";
import StatCard from "@/components/statCard";
import StatusBadge from "@/components/statusBadge";
import { useIssueStore } from "@/store/issueStore";
import { useThemeStore } from "@/store/themeStore";
import { router } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
export default function DashboardScreen() {
  const { issues, isLoading, error, lastSynced, syncQueue, fetchIssues } =
    useIssueStore();
  const isDark = useThemeStore((s) => s.mode === "dark");

  useEffect(() => {
    fetchIssues();
  }, []);
  const counts = {
    open: issues.filter((i) => i.status === "open").length,
    in_progress: issues.filter((i) => i.status === "in_progress").length,
    resolved: issues.filter((i) => i.status === "resolved").length,
    closed: issues.filter((i) => i.status === "closed").length,
  };

  const formatLastSynced = () => {
    if (!lastSynced) return "Never synced";
    const diff = Math.floor(
      (Date.now() - new Date(lastSynced).getTime()) / 1000 / 60,
    );
    if (diff === 0) return "Synced just now";
    if (diff === 1) return "Synced 1 minute ago";
    return `Synced ${diff} minutes ago`;
  };
  return (
    <ScrollView
      className={`flex-1 ${isDark ? "bg-gray-950" : "bg-gray-50"}`}
      contentContainerStyle={{ padding: 20, gap: 16 }}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={fetchIssues} />
      }
    >
      {/* Sync status */}
      <View className="flex-row items-center justify-between">
        <Text className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
          {formatLastSynced()}
        </Text>
        {syncQueue.length > 0 && (
          <View className="bg-yellow-100 px-2 py-1 rounded-full">
            <Text className="text-yellow-700 text-xs font-semibold">
              {syncQueue.length} pending sync
            </Text>
          </View>
        )}
      </View>

      {/* Error */}
      {error && (
        <View className="bg-red-100 rounded-xl p-4">
          <Text className="text-red-700 text-sm">{error}</Text>
          <Pressable onPress={fetchIssues} className="mt-2">
            <Text className="text-red-500 text-sm font-semibold">
              Tap to retry
            </Text>
          </Pressable>
        </View>
      )}

      {/* Status cards */}
      <Text className={`text-lg font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}>Overview</Text>

      <View className="flex-row gap-3">
        <StatCard label="Open" count={counts.open} color="bg-blue-500" />
        <StatCard
          label="In Progress"
          count={counts.in_progress}
          color="bg-yellow-500"
        />
      </View>
      <View className="flex-row gap-3">
        <StatCard
          label="Resolved"
          count={counts.resolved}
          color="bg-green-500"
        />
        <StatCard label="Closed" count={counts.closed} color="bg-gray-400" />
      </View>

      {/* Total */}
      <View
        className={`rounded-2xl p-4 border ${
          isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
        }`}
      >
        <Text className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Total Issues</Text>
        <Text className={`text-3xl font-bold mt-1 ${isDark ? "text-gray-100" : "text-gray-900"}`}>
          {issues.length}
        </Text>
      </View>

      {/* Recent issues */}
      <Text className={`text-lg font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}>
        Recent Issues
      </Text>

      {isLoading && issues.length === 0 ? (
        <ActivityIndicator color="#3B82F6" />
      ) : issues.length === 0 ? (
        <View
          className={`rounded-2xl p-8 items-center border ${
            isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
          }`}
        >
          <Text className={`text-sm ${isDark ? "text-gray-400" : "text-gray-400"}`}>No issues yet</Text>
          <Pressable
            className="mt-4 bg-blue-500 px-4 py-2 rounded-lg"
            onPress={() => router.push("/issue/create")}
          >
            <Text className="text-white text-sm font-semibold">
              Create First Issue
            </Text>
          </Pressable>
        </View>
      ) : (
        issues.slice(0, 5).map((issue) => (
          <Pressable
            key={issue.id}
            className={`rounded-2xl p-4 border ${
              isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
            }`}
            onPress={() => router.push(`/issue/${issue.id}`)}
          >
            <View className="flex-row items-center justify-between mb-1">
              <Text
                className={`font-semibold flex-1 mr-2 ${isDark ? "text-gray-100" : "text-gray-900"}`}
                numberOfLines={1}
              >
                {issue.title}
              </Text>
              <StatusBadge status={issue.status} />
            </View>
            <View className="flex-row items-center gap-2 mt-1">
              <PriorityBadge priority={issue.priority} />
              {issue.isDirty && (
                <Text className="text-xs text-yellow-600">Unsynced</Text>
              )}
            </View>
          </Pressable>
        ))
      )}

      {issues.length > 5 && (
        <Pressable
          className="items-center py-3"
          onPress={() => router.push("/issues")}
        >
          <Text className="text-blue-500 text-sm font-semibold">
            View all {issues.length} issues
          </Text>
        </Pressable>
      )}
    </ScrollView>
  );
}
