import { useAuthStore } from "@/store/authStore";
import { router, Slot, useSegments } from "expo-router";
import { useEffect } from "react";

function AuthGuard() {
  const user = useAuthStore((s) => s.user);
  const segments = useSegments();

  useEffect(() => {
    const inAuthScreen = segments[0] === "login";

    if (!user && !inAuthScreen) {
      router.replace("/login");
    }

    if (user && inAuthScreen) {
      router.replace("/(tabs)");
    }
  }, [user, segments]);

  return <Slot />;
}

export default function RootLayout() {
  return <AuthGuard />;
}
