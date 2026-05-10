import { Issue } from "../types";
export const MOCK_ISSUES: Issue[] = [
  {
    id: "seed_1",
    title: "Login button not responding on Android",
    description:
      "Users report the login button does nothing on Android 13 devices.",
    status: "open",
    priority: "critical",
    assignee: "Mewan",
    createdAt: "2026-05-01T08:00:00.000Z",
    updatedAt: "2026-05-01T08:00:00.000Z",
  },
  {
    id: "seed_2",
    title: "Dashboard counts incorrect after filter",
    description:
      "Status counts on dashboard do not update when filters are applied.",
    status: "in_progress",
    priority: "high",
    assignee: "Dilshan",
    createdAt: "2026-05-02T09:30:00.000Z",
    updatedAt: "2026-05-03T11:00:00.000Z",
  },
  {
    id: "seed_3",
    title: "Dark mode colors broken on profile screen",
    description: "Text becomes invisible in dark mode on the profile screen.",
    status: "open",
    priority: "medium",
    createdAt: "2026-05-03T14:00:00.000Z",
    updatedAt: "2026-05-03T14:00:00.000Z",
  },
  {
    id: "seed_4",
    title: "Export to CSV missing assignee column",
    description: "The exported CSV file does not include the assignee field.",
    status: "resolved",
    priority: "low",
    assignee: "Mewan",
    createdAt: "2026-05-04T10:00:00.000Z",
    updatedAt: "2026-05-05T16:00:00.000Z",
    resolvedAt: "2026-05-05T16:00:00.000Z",
  },
  {
    id: "seed_5",
    title: "App crashes on pull-to-refresh with no internet",
    description:
      "Pulling to refresh while offline throws an unhandled promise rejection.",
    status: "open",
    priority: "high",
    createdAt: "2026-05-06T07:45:00.000Z",
    updatedAt: "2026-05-06T07:45:00.000Z",
  },
];
