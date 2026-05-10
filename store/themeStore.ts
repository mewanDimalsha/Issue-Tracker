import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ThemeMode = "light" | "dark";

interface ThemeStore {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      mode: "light",
      setMode: (mode) => set({ mode }),
      toggleMode: () =>
        set({ mode: get().mode === "dark" ? "light" : "dark" }),
    }),
    {
      name: "theme-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ mode: state.mode }),
    },
  ),
);
