import { z } from "zod";

// ─── Login Schema ────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Enter a valid email address.")
    .max(254, "Email is too long."),

  password: z
    .string()
    .min(1, "Password is required.")
    .min(6, "Password must be at least 6 characters.")
    .max(128, "Password is too long.")
    .regex(/[a-zA-Z]/, "Password must contain at least one letter.")
    .regex(/[0-9]/, "Password must contain at least one number."),
});

// ─── Issue Schema ─────────────────────────────────────────────────────────────

export const issueSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required.")
    .min(3, "Title must be at least 3 characters.")
    .max(100, "Title cannot exceed 100 characters."),

  description: z
    .string()
    .min(1, "Description is required.")
    .min(10, "Description must be at least 10 characters.")
    .max(1000, "Description cannot exceed 1000 characters."),

  priority: z.enum(["low", "medium", "high", "critical"], {
    error: () => ({ message: "Select a valid priority." }),
  }),

  status: z.enum(["open", "in_progress", "resolved", "closed"], {
    error: () => ({ message: "Select a valid status." }),
  }),

  assignee: z.string().max(50, "Assignee name too long.").optional(),
});

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type LoginFormData = z.infer<typeof loginSchema>;
export type IssueFormData = z.infer<typeof issueSchema>;
