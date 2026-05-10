import { useIssueStore } from "@/store/issueStore";
import { router, useLocalSearchParams } from "expo-router";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";

export default function IssueDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { issues, resolveIssue, deleteIssue } = useIssueStore();

  const issue = issues.find((i) => i.id === id);

  if (!issue) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-gray-400 text-base">Issue not found</Text>
        <Pressable
          className="mt-4 bg-blue-500 px-4 py-2 rounded-lg"
          onPress={() => router.back()}
        >
          <Text className="text-white text-sm font-semibold">Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const handleResolve = () => {
    Alert.alert("Resolve Issue", "Mark this issue as resolved?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Resolve",
        onPress: async () => {
          await resolveIssue(issue.id);
          router.back();
        },
      },
    ]);
  };

  const handleDelete = () => {
    Alert.alert("Delete Issue", "This cannot be undone. Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteIssue(issue.id);
          router.back();
        },
      },
    ]);
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      contentContainerStyle={{ padding: 20, gap: 16 }}
    >
      {/* Header */}
      <View className="bg-white rounded-2xl p-4 border border-gray-100 gap-3">
        <Text className="text-xl font-bold text-gray-900">{issue.title}</Text>

        <View className="flex-row gap-2 flex-wrap">
          <View
            className={`px-3 py-1 rounded-full ${statusConfig[issue.status]}`}
          >
            <Text
              className={`text-xs font-semibold ${statusConfig[issue.status]}`}
            >
              {issue.status === "in_progress"
                ? "In Progress"
                : issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}
            </Text>
          </View>

          <View
            className={`px-3 py-1 rounded-full ${priorityConfig[issue.priority]}`}
          >
            <Text
              className={`text-xs font-semibold ${priorityConfig[issue.priority]}`}
            >
              {issue.priority.charAt(0).toUpperCase() + issue.priority.slice(1)}{" "}
              Priority
            </Text>
          </View>

          {issue.isDirty && (
            <View className="px-3 py-1 rounded-full bg-yellow-100">
              <Text className="text-xs font-semibold text-yellow-700">
                Unsynced
              </Text>
            </View>
          )}

          {issue.isLocalOnly && (
            <View className="px-3 py-1 rounded-full bg-orange-100">
              <Text className="text-xs font-semibold text-orange-700">
                Local Only
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Description */}
      <View className="bg-white rounded-2xl p-4 border border-gray-100 gap-2">
        <Text className="text-sm font-semibold text-gray-500 uppercase">
          Description
        </Text>
        <Text className="text-gray-700 text-base leading-6">
          {issue.description}
        </Text>
      </View>

      {/* Details */}
      <View className="bg-white rounded-2xl p-4 border border-gray-100 gap-3">
        <Text className="text-sm font-semibold text-gray-500 uppercase">
          Details
        </Text>

        <DetailRow label="Assignee" value={issue.assignee ?? "Unassigned"} />
        <DetailRow label="Created" value={formatDate(issue.createdAt)} />
        <DetailRow label="Updated" value={formatDate(issue.updatedAt)} />
        {issue.resolvedAt && (
          <DetailRow label="Resolved" value={formatDate(issue.resolvedAt)} />
        )}
        <DetailRow label="ID" value={issue.id} />
      </View>

      {/* Actions */}
      <View className="gap-3">
        {issue.status !== "resolved" && issue.status !== "closed" && (
          <Pressable
            className="bg-green-500 rounded-xl p-4 items-center"
            onPress={handleResolve}
          >
            <Text className="text-white font-bold text-base">
              Mark as Resolved
            </Text>
          </Pressable>
        )}

        <Pressable
          className="bg-blue-500 rounded-xl p-4 items-center"
          onPress={() => router.push(`/issue/${issue.id}/edit`)}
        >
          <Text className="text-white font-bold text-base">Edit Issue</Text>
        </Pressable>

        <Pressable
          className="bg-red-50 border border-red-200 rounded-xl p-4 items-center"
          onPress={handleDelete}
        >
          <Text className="text-red-500 font-bold text-base">Delete Issue</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row items-start justify-between gap-4">
      <Text className="text-sm text-gray-400 w-24">{label}</Text>
      <Text className="text-sm text-gray-700 flex-1 text-right">{value}</Text>
    </View>
  );
}
