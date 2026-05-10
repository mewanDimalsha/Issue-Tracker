import { useAuthStore } from "@/store/authStore";
import { router, Stack, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import "../global.css";

function AuthGuard() {
  const user = useAuthStore((s) => s.user);
  const [hasHydrated, setHasHydrated] = useState(
    useAuthStore.persist.hasHydrated(),
  );
  const segments = useSegments();

  useEffect(() => {
    const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    const currentSegment = segments[0];
    if (!currentSegment) return;
    const inAuthScreen = currentSegment === "login";
    if (!user && !inAuthScreen) router.replace("/login");
    if (user && inAuthScreen) router.replace("/(tabs)");
  }, [user, segments, hasHydrated]);

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
