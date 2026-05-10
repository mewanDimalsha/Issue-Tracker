import { Text, View } from "lucide-react-native";

export default function StatCard({
  label,
  count,
  color,
}: {
  label: string;
  count: number;
  color: string;
}) {
  return (
    <View className="flex-1 bg-white rounded-2xl p-4 border border-gray-100">
      <View className={`w-2 h-2 rounded-full ${color} mb-3`} />
      <Text className="text-2xl font-bold text-gray-900">{count}</Text>
      <Text className="text-xs text-gray-500 mt-1">{label}</Text>
    </View>
  );
}
