import { useThemeStore } from "@/store/themeStore";
import { Text, View } from "react-native";

export default function StatCard({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: string;
}) {
  const isDark = useThemeStore((s) => s.mode === "dark");

  return (
    <View
      className={`flex-1 rounded-2xl p-4 border ${
        isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"
      }`}
    >
      <View className={`w-2 h-2 rounded-full ${color} mb-3`} />
      <Text className={`text-2xl font-bold ${isDark ? "text-gray-100" : "text-gray-900"}`}>
        {count}
      </Text>
      <Text className={`text-xs mt-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
        {label}
      </Text>
    </View>
  );
}
