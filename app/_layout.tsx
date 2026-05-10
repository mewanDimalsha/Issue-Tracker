import { useAuthStore } from "@/store/authStore";
import { router, Slot, useSegments } from "expo-router";
import { useEffect } from "react";
import "../global.css";

function AuthGuard() {
  const user = useAuthStore((s) => s.user);
  const segments = useSegments();

  useEffect(() => {
    // segments[0] is undefined while router is still mounting
    // we wait until segments has a value
    if (segments.length === 0) return;

    const inAuthScreen = segments[0] === "login";

    if (!user && !inAuthScreen) {
      router.replace("/login");
    }

    if (user && inAuthScreen) {
      router.replace("/index");
    }
  }, [user, segments]);

  return <Slot />;
}

export default function RootLayout() {
  return <AuthGuard />;
}
