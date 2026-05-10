import { useAuthStore } from "@/store/authStore";
import { router, Stack, useSegments } from "expo-router";
import { useEffect } from "react";
import "../global.css";

function AuthGuard() {
  const user = useAuthStore((s) => s.user);
  const segments = useSegments();

  useEffect(() => {
    if (segments.length === 0) return;
    const inAuthScreen = segments[0] === "login";
    if (!user && !inAuthScreen) router.replace("/login");
    if (user && inAuthScreen) router.replace("/index");
  }, [user, segments]);

  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="issue/create"
        options={{
          title: "Create Issue",
          headerBackTitle: "Back",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="issue/[id]/index"
        options={{
          title: "Issue Detail",
          headerBackTitle: "Back",
        }}
      />
      <Stack.Screen
        name="issue/[id]/edit"
        options={{
          title: "Edit Issue",
          headerBackTitle: "Back",
          presentation: "modal",
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return <AuthGuard />;
}
