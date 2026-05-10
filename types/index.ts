export type IssueStatus = "open" | "closed" | "in_progress" | "resolved";
export type IssuePriority = "low" | "medium" | "high" | "critical";
export interface Issue {
  id: string;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  assignee?: string; // ? means optional
  createdAt: string; // ISO date string e.g. "2026-05-09T10:00:00.000Z"
  updatedAt: string;
  resolvedAt?: string;
  isLocalOnly?: boolean; // true = created offline, not yet on server
  isDirty?: boolean; // true = edited offline, needs sync
}
export interface User {
  id: string;
  name: string;
  email: string;
  token: string; // for authentication
}
//UI state types
export interface FilterState {
  search: string;
  status: IssueStatus | "all";
  priority: IssuePriority | "all";
}
//Offline sync
export interface SyncQueueItem {
  id: string;
  action: "create" | "update" | "resolve";
  issue: Partial<Issue>;
  timestamp: string; // ISO date string
}
