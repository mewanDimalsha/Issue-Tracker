import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

export default function LoginScreen() {
  const { login, isLoading, error, fieldErrors, clearErrors } = useAuthStore();
  const isDark = useThemeStore((s) => s.mode === "dark");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    await login(email.trim(), password);
  };

  return (
    <KeyboardAvoidingView
      className={`flex-1 ${isDark ? "bg-gray-950" : "bg-gray-50"}`}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
        className="px-6"
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View className="mb-10">
          <Text className={`text-4xl font-bold mb-2 ${isDark ? "text-gray-100" : "text-gray-900"}`}>
            Issue Tracker
          </Text>
          <Text className={`text-base ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            Sign in to your account
          </Text>
        </View>

        {/* Form */}
        <View className="gap-4">
          {/* Email */}
          <View className="gap-1">
            <Text className={`text-sm font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>Email</Text>
            <TextInput
              className={`border rounded-xl p-4 text-base ${
                isDark ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"
              } ${fieldErrors.email ? "border-red-500" : isDark ? "border-gray-700" : "border-gray-300"
              }`}
              placeholder="mewan@example.com"
              placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                clearErrors();
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
            {fieldErrors.email && (
              <Text className="text-xs text-red-500">{fieldErrors.email}</Text>
            )}
          </View>

          {/* Password */}
          <View className="gap-1">
            <Text className={`text-sm font-semibold ${isDark ? "text-gray-300" : "text-gray-700"}`}>
              Password
            </Text>
            <View
              className={`flex-row items-center border rounded-xl ${
                isDark ? "bg-gray-900" : "bg-white"
              } ${
                fieldErrors.password ? "border-red-500" : isDark ? "border-gray-700" : "border-gray-300"
              }`}
            >
              <TextInput
                className={`flex-1 p-4 text-base ${isDark ? "text-gray-100" : "text-gray-900"}`}
                placeholder="Enter your password"
                placeholderTextColor={isDark ? "#6B7280" : "#9CA3AF"}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  clearErrors();
                }}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
              <Pressable
                className="px-4 py-4"
                onPress={() => setShowPassword((prev) => !prev)}
              >
                <Text className="text-sm font-semibold text-blue-500">
                  {showPassword ? "Hide" : "Show"}
                </Text>
              </Pressable>
            </View>
            {fieldErrors.password && (
              <Text className="text-xs text-red-500">
                {fieldErrors.password}
              </Text>
            )}
          </View>

          {/* General error */}
          {error && (
            <View className="bg-red-100 rounded-lg p-3">
              <Text className="text-red-700 text-sm">{error}</Text>
            </View>
          )}

          {/* Submit button */}
          <Pressable
            className={`rounded-xl p-4 items-center mt-2 ${
              isLoading ? "bg-blue-400" : "bg-blue-500"
            }`}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-base font-bold">Sign In</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
