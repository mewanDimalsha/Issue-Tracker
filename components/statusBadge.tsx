import { Text, View } from "react-native";

export default function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; bgClass: string; textClass: string }> = {
    open: {
      label: "Open",
      bgClass: "bg-blue-100",
      textClass: "text-blue-700",
    },
    in_progress: {
      label: "In Progress",
      bgClass: "bg-yellow-100",
      textClass: "text-yellow-700",
    },
    resolved: {
      label: "Resolved",
      bgClass: "bg-green-100",
      textClass: "text-green-700",
    },
    closed: {
      label: "Closed",
      bgClass: "bg-gray-100",
      textClass: "text-gray-600",
    },
  };
  const { label, bgClass, textClass } = config[status] ?? config.open;
  return (
    <View className={`px-2 py-0.5 rounded-full ${bgClass}`}>
      <Text className={`text-xs font-semibold ${textClass}`}>{label}</Text>
    </View>
  );
}
