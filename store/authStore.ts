import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { User } from "../types";
import { loginSchema } from "../utils/validators";

// ─── Mock Database ────────────────────────────────────────────────────────────

interface MockUserSeed {
  id: string;
  email: string;
  password: string; // only exists here, never leaves this file
  name: string;
  token: string;
}

const MOCK_USERS: MockUserSeed[] = [
  {
    id: "user_1",
    email: "mewan@example.com",
    password: "mewan123",
    name: "Mewan",
    token: "mock_token_abc123",
  },
  {
    id: "user_2",
    email: "admin@example.com",
    password: "admin123",
    name: "Admin",
    token: "mock_token_xyz456",
  },
];

// ─── Store Interface ──────────────────────────────────────────────────────────

interface AuthStore {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  fieldErrors: Record<string, string>; // per-field errors for the form UI
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearErrors: () => void;
}
// ─── Store ────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,
      fieldErrors: {},

      login: async (email: string, password: string) => {
        // clear previous errors, start loading
        set({ isLoading: true, error: null, fieldErrors: {} });

        // simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // step 1 — zod validates format
        const result = loginSchema.safeParse({ email, password });

        if (!result.success) {
          // convert zod errors into a field → message map
          const fieldErrors: Record<string, string> = {};
          result.error.issues.forEach((err) => {
            const field = err.path[0] as string;
            // only store first error per field
            if (!fieldErrors[field]) {
              fieldErrors[field] = err.message;
            }
          });
          set({ isLoading: false, fieldErrors });
          return;
        }

        // step 2 — check credentials against mock database
        // result.data is the validated + typed data from Zod
        const found = MOCK_USERS.find(
          (u) =>
            u.email === result.data.email &&
            u.password === result.data.password,
        );

        if (!found) {
          // vague on purpose — don't tell attacker which field was wrong
          set({ isLoading: false, error: "Invalid email or password." });
          return;
        }

        // step 3 — build User without password, store it
        const user: User = {
          id: found.id,
          email: found.email,
          name: found.name,
          token: found.token,
        };

        set({ user, isLoading: false, error: null, fieldErrors: {} });
      },

      logout: () => {
        set({ user: null, error: null, fieldErrors: {} });
      },

      clearErrors: () => {
        set({ error: null, fieldErrors: {} });
      },
    }),
    {
      name: "auth-store",
      storage: createJSONStorage(() => AsyncStorage),
      // only persist user — no point saving loading/error states
      partialize: (state) => ({ user: state.user }),
    },
  ),
);
