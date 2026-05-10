import { useIssueStore } from "@/store/issueStore";
import { useThemeStore } from "@/store/themeStore";
import { Issue } from "@/types";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  View,
} from "react-native";

export default function IssuesScreen() {
  const {
    fetchIssues,
    issues,
    setFilters,
    clearFilters,
    filters,
    isLoading,
    error,
  } = useIssueStore();
  const isDark = useThemeStore((s) => s.mode === "dark");

  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchIssues();
  }, []);
  const debouncedSearch = useDebounce(searchText, 300);

  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      filters.search.trim() === "" ||
      issue.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      issue.description.toLowerCase().includes(filters.search.toLowerCase());

    const matchesStatus =
      filters.status === "all" || issue.status === filters.status;

    const matchesPriority =
      filters.priority === "all" || issue.priority === filters.priority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  useEffect(() => {
    setFilters({ search: debouncedSearch });
  }, [debouncedSearch]);

  return (
    <View className={`flex-1 ${isDark ? "bg-gray-950" : "bg-gray-50"}`}>
      {/* Search bar */}
      <View
        className={`px-4 py-3 border-b ${
          isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
        }`}
      >
        <TextInput
          className={`rounded-xl px-4 py-3 text-base ${
            isDark ? "bg-gray-800 text-gray-100" : "bg-gray-100 text-gray-900"
          }`}
          placeholder="Search issues..."
          placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* Filters */}
      <View
        className={`px-4 py-2 border-b ${
          isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
        }`}
      >
        <Text className={`text-xs font-semibold mb-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          STATUS
        </Text>
        <View className="flex-row gap-2 flex-wrap">
          {(["all", "open", "in_progress", "resolved", "closed"] as const).map(
            (status) => (
              <Pressable
                key={status}
                onPress={() => setFilters({ status })}
                className={`px-3 py-1 rounded-full border ${
                  filters.status === status
                    ? "bg-blue-500 border-blue-500"
                    : isDark
                      ? "bg-gray-900 border-gray-700"
                      : "bg-white border-gray-300"
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    filters.status === status
                      ? "text-white"
                      : isDark
                        ? "text-gray-300"
                        : "text-gray-600"
                  }`}
                >
                  {status === "all"
                    ? "All"
                    : status === "in_progress"
                      ? "In Progress"
                      : status.charAt(0).toUpperCase() + status.slice(1)}
                </Text>
              </Pressable>
            ),
          )}
        </View>

        <Text className={`text-xs font-semibold mb-2 mt-3 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          PRIORITY
        </Text>
        <View className="flex-row gap-2 flex-wrap">
          {(["all", "low", "medium", "high", "critical"] as const).map(
            (priority) => (
              <Pressable
                key={priority}
                onPress={() => setFilters({ priority })}
                className={`px-3 py-1 rounded-full border ${
                  filters.priority === priority
                    ? "bg-blue-500 border-blue-500"
                    : isDark
                      ? "bg-gray-900 border-gray-700"
                      : "bg-white border-gray-300"
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    filters.priority === priority
                      ? "text-white"
                      : isDark
                        ? "text-gray-300"
                        : "text-gray-600"
                  }`}
                >
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </Text>
              </Pressable>
            ),
          )}
        </View>

        {/* Clear filters */}
        {(filters.status !== "all" ||
          filters.priority !== "all" ||
          filters.search !== "") && (
          <Pressable
            onPress={() => {
              clearFilters();
              setSearchText("");
            }}
            className="mt-2"
          >
            <Text className="text-blue-500 text-xs font-semibold">
              Clear filters
            </Text>
          </Pressable>
        )}
      </View>

      {/* Error */}
      {error && (
        <View className="bg-red-100 mx-4 mt-3 rounded-xl p-3">
          <Text className="text-red-700 text-sm">{error}</Text>
        </View>
      )}

      {/* List */}
      <FlatList
        data={filteredIssues}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 10 }}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={fetchIssues} />
        }
        renderItem={({ item }) => <IssueCard issue={item} />}
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            {isLoading ? (
              <ActivityIndicator color="#3B82F6" />
            ) : (
              <>
                <Text className="text-gray-400 text-base">No issues found</Text>
                <Text className="text-gray-300 text-sm mt-1">
                  Try adjusting your filters
                </Text>
              </>
            )}
          </View>
        }
      />

      {/* FAB — floating action button */}
      <Pressable
        className="absolute bottom-6 right-6 bg-blue-500 w-14 h-14 rounded-full items-center justify-center shadow-lg"
        onPress={() => router.push("/issue/create")}
      >
        <Text className="text-white text-3xl font-light">+</Text>
      </Pressable>
    </View>
  );
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

function IssueCard({ issue }: { issue: Issue }) {
  const isDark = useThemeStore((s) => s.mode === "dark");
  const priorityConfig: Record<string, string> = {
    low: "bg-gray-100 text-gray-600",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-orange-100 text-orange-700",
    critical: "bg-red-100 text-red-700",
  };

  const statusConfig: Record<string, string> = {
    open: "bg-blue-100 text-blue-700",
    in_progress: "bg-yellow-100 text-yellow-700",
    resolved: "bg-green-100 text-green-700",
    closed: "bg-gray-100 text-gray-600",
  };

  const priorityClass = priorityConfig[issue.priority] ?? priorityConfig.low;
  const statusClass = statusConfig[issue.status] ?? statusConfig.open;

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Pressable
      className={`rounded-2xl p-4 border active:opacity-70 ${
        isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
      }`}
      onPress={() => router.push(`/issue/${issue.id}`)}
    >
      {/* Title row */}
      <View className="flex-row items-start justify-between gap-2">
        <Text
          className={`font-semibold text-base flex-1 ${isDark ? "text-gray-100" : "text-gray-900"}`}
          numberOfLines={2}
        >
          {issue.title}
        </Text>
        <View className={`px-2 py-0.5 rounded-full ${statusClass}`}>
          <Text className={`text-xs font-semibold ${statusClass}`}>
            {issue.status === "in_progress"
              ? "In Progress"
              : issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
          </Text>
        </View>
      </View>

      {/* Description */}
      <Text className={`text-sm mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`} numberOfLines={2}>
        {issue.description}
      </Text>

      {/* Bottom row */}
      <View className="flex-row items-center justify-between mt-3">
        <View className="flex-row items-center gap-2">
          <View className={`px-2 py-0.5 rounded-full ${priorityClass}`}>
            <Text className={`text-xs font-semibold ${priorityClass}`}>
              {issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)}
            </Text>
          </View>
          {issue.assignee && (
            <Text className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>{issue.assignee}</Text>
          )}
          {issue.isDirty && (
            <Text className="text-xs text-yellow-600 font-semibold">
              Unsynced
            </Text>
          )}
          {issue.isLocalOnly && (
            <Text className="text-xs text-orange-600 font-semibold">
              Local only
            </Text>
          )}
        </View>
        <Text className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
          {formatDate(issue.createdAt)}
        </Text>
      </View>
    </Pressable>
  );
}
