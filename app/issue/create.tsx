import { useIssueStore } from "@/store/issueStore";
import { IssueFormData, issueSchema } from "@/utils/validators";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

export default function CreateIssueScreen() {
  const { createIssue } = useIssueStore();

  const [form, setForm] = useState<IssueFormData>({
    title: "",
    description: "",
    priority: "medium",
    status: "open",
    assignee: "",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof IssueFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // clear that field's error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async () => {
    // validate with zod
    const result = issueSchema.safeParse(form);

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        if (!errors[field]) errors[field] = issue.message;
      });
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      await createIssue({
        ...result.data,
        assignee: result.data.assignee || undefined,
      });
      router.back();
    } catch {
      Alert.alert("Error", "Failed to create issue. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-50"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ padding: 20, gap: 16 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Title */}
        <View className="gap-1">
          <Text className="text-sm font-semibold text-gray-700">
            Title <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            className={`bg-white border rounded-xl p-4 text-base text-gray-900 ${
              fieldErrors.title ? "border-red-500" : "border-gray-200"
            }`}
            placeholder="Short descriptive title"
            placeholderTextColor="#9CA3AF"
            value={form.title}
            onChangeText={(text) => updateField("title", text)}
            maxLength={100}
          />
          {fieldErrors.title && (
            <Text className="text-xs text-red-500">{fieldErrors.title}</Text>
          )}
          <Text className="text-xs text-gray-400 text-right">
            {form.title.length}/100
          </Text>
        </View>

        {/* Description */}
        <View className="gap-1">
          <Text className="text-sm font-semibold text-gray-700">
            Description <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            className={`bg-white border rounded-xl p-4 text-base text-gray-900 ${
              fieldErrors.description ? "border-red-500" : "border-gray-200"
            }`}
            placeholder="Describe the issue in detail"
            placeholderTextColor="#9CA3AF"
            value={form.description}
            onChangeText={(text) => updateField("description", text)}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            maxLength={1000}
          />
          {fieldErrors.description && (
            <Text className="text-xs text-red-500">
              {fieldErrors.description}
            </Text>
          )}
          <Text className="text-xs text-gray-400 text-right">
            {form.description.length}/1000
          </Text>
        </View>

        {/* Priority */}
        <View className="gap-2">
          <Text className="text-sm font-semibold text-gray-700">Priority</Text>
          <View className="flex-row gap-2">
            {(["low", "medium", "high", "critical"] as const).map((p) => (
              <Pressable
                key={p}
                onPress={() => updateField("priority", p)}
                className={`flex-1 py-2 rounded-xl items-center border ${
                  form.priority === p
                    ? "bg-blue-500 border-blue-500"
                    : "bg-white border-gray-200"
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    form.priority === p ? "text-white" : "text-gray-600"
                  }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Status */}
        <View className="gap-2">
          <Text className="text-sm font-semibold text-gray-700">Status</Text>
          <View className="flex-row gap-2 flex-wrap">
            {(["open", "in_progress", "resolved", "closed"] as const).map(
              (s) => (
                <Pressable
                  key={s}
                  onPress={() => updateField("status", s)}
                  className={`px-3 py-2 rounded-xl items-center border ${
                    form.status === s
                      ? "bg-blue-500 border-blue-500"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      form.status === s ? "text-white" : "text-gray-600"
                    }`}
                  >
                    {s === "in_progress"
                      ? "In Progress"
                      : s.charAt(0).toUpperCase() + s.slice(1)}
                  </Text>
                </Pressable>
              ),
            )}
          </View>
        </View>

        {/* Assignee */}
        <View className="gap-1">
          <Text className="text-sm font-semibold text-gray-700">
            Assignee{" "}
            <Text className="text-gray-400 font-normal">(optional)</Text>
          </Text>
          <TextInput
            className="bg-white border border-gray-200 rounded-xl p-4 text-base text-gray-900"
            placeholder="Who is responsible?"
            placeholderTextColor="#9CA3AF"
            value={form.assignee}
            onChangeText={(text) => updateField("assignee", text)}
            maxLength={50}
          />
        </View>

        {/* Submit */}
        <Pressable
          className={`rounded-xl p-4 items-center mt-2 ${
            isSubmitting ? "bg-blue-400" : "bg-blue-500"
          }`}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-base font-bold">Create Issue</Text>
          )}
        </Pressable>

        {/* Cancel */}
        <Pressable
          className="items-center py-3"
          onPress={() => router.back()}
          disabled={isSubmitting}
        >
          <Text className="text-gray-400 text-sm">Cancel</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
