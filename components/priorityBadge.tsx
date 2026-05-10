import { Text, View } from "react-native";
export default function PriorityBadge({ priority }: { priority: string }) {
  const config: Record<string, { label: string; bgClass: string; textClass: string }> = {
    low: { label: "Low", bgClass: "bg-gray-100", textClass: "text-gray-600" },
    medium: {
      label: "Medium",
      bgClass: "bg-yellow-100",
      textClass: "text-yellow-700",
    },
    high: {
      label: "High",
      bgClass: "bg-orange-100",
      textClass: "text-orange-700",
    },
    critical: {
      label: "Critical",
      bgClass: "bg-red-100",
      textClass: "text-red-700",
    },
  };
  const { label, bgClass, textClass } = config[priority] ?? config.low;
  return (
    <View className={`px-2 py-0.5 rounded-full ${bgClass}`}>
      <Text className={`text-xs font-semibold ${textClass}`}>{label}</Text>
    </View>
  );
}
