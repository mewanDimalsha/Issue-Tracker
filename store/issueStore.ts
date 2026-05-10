import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { mockApi } from "../api/mockApi";
import { FilterState, Issue, SyncQueueItem } from "../types";

interface IssueStore {
  issues: Issue[];
  syncQueue: SyncQueueItem[];
  filters: FilterState;
  isLoading: boolean;
  error: string | null;
  lastSynced: string | null;

  fetchIssues: () => Promise<void>;
  createIssue: (
    data: Omit<
      Issue,
      "id" | "createdAt" | "updatedAt" | "isLocalOnly" | "isDirty"
    >,
  ) => Promise<void>;
  updateIssue: (id: string, updates: Partial<Issue>) => Promise<void>;
  resolveIssue: (id: string) => Promise<void>;
  deleteIssue: (id: string) => Promise<void>;
  setFilters: (filters: Partial<FilterState>) => void;
  clearFilters: () => void;
  syncPendingQueue: () => Promise<void>;
  getFilteredIssues: () => Issue[];
}

const DEFAULT_FILTERS: FilterState = {
  search: "",
  status: "all",
  priority: "all",
};

export const useIssueStore = create<IssueStore>()(
  persist(
    (set, get) => ({
      issues: [],
      syncQueue: [],
      filters: DEFAULT_FILTERS,
      isLoading: false,
      error: null,
      lastSynced: null,

      fetchIssues: async () => {
        set({ isLoading: true, error: null });
        try {
          const remote = await mockApi.getIssues();
          const localOnly = get().issues.filter((issue) => issue.isLocalOnly);
          set({
            issues: [...remote, ...localOnly],
            isLoading: false,
            lastSynced: new Date().toISOString(),
          });
        } catch (err: unknown) {
          const message =
            err instanceof Error ? err.message : "Failed to fetch issues.";
          set({ isLoading: false, error: message });
        }
      },

      createIssue: async (data) => {
        const tempId = `local_${Date.now()}`;
        const now = new Date().toISOString();

        const optimisticIssue: Issue = {
          ...data,
          id: tempId,
          createdAt: now,
          updatedAt: now,
          isLocalOnly: true,
        };

        // add to UI immediately before API call
        set((s) => ({ issues: [optimisticIssue, ...s.issues] }));

        try {
          const created = await mockApi.createIssue(data);
          // replace temp issue with real server response
          set((s) => ({
            issues: s.issues.map((i) =>
              i.id === tempId ? { ...created, isLocalOnly: false } : i,
            ),
          }));
        } catch {
          // API failed — keep the issue locally, queue it for later sync
          set((s) => ({
            syncQueue: [
              ...s.syncQueue,
              {
                id: tempId,
                action: "create",
                issue: optimisticIssue,
                timestamp: now,
              },
            ],
          }));
        }
      },
      updateIssue: async (id, data) => {
        const now = new Date().toISOString();

        set((s) => ({
          issues: s.issues.map((i) =>
            i.id === id ? { ...i, ...data, updatedAt: now } : i,
          ),
        }));

        try {
          await mockApi.updateIssue(id, data);
        } catch {
          set((s) => ({
            issues: s.issues.map((i) =>
              i.id === id ? { ...i, isDirty: true } : i,
            ),
            syncQueue: [
              ...s.syncQueue,
              { id, action: "update", issue: data, timestamp: now },
            ],
          }));
        }
      },
      resolveIssue: async (id) => {
        const now = new Date().toISOString();
        // Optimistically mark as resolved in UI
        set((s) => ({
          issues: s.issues.map((i) =>
            i.id === id
              ? { ...i, status: "resolved", updatedAt: now, resolvedAt: now }
              : i,
          ),
        }));
        try {
          await mockApi.resolveIssue(id);
        } catch {
          // If API call fails, revert status and queue for retry
          set((s) => ({
            syncQueue: [
              ...s.syncQueue,
              {
                id,
                action: "resolve",
                issue: { status: "resolved" },
                timestamp: now,
              },
            ],
          }));
        }
      },
      deleteIssue: async (id) => {
        // optimistic — remove from UI immediately
        set((s) => ({ issues: s.issues.filter((i) => i.id !== id) }));
        // no sync queue for delete — if API fails, issue is just gone locally
        // acceptable tradeoff for a mock app
      },
      setFilters: (filters) => {
        set((s) => ({ filters: { ...s.filters, ...filters } }));
      },

      clearFilters: () => {
        set({ filters: DEFAULT_FILTERS });
      },
      syncPendingQueue: async () => {
        const { syncQueue } = get();
        if (syncQueue.length === 0) return;

        const synced: string[] = [];

        for (const item of syncQueue) {
          try {
            if (item.action === "create") {
              await mockApi.createIssue(
                item.issue as Omit<
                  Issue,
                  "id" | "createdAt" | "updatedAt" | "isLocalOnly" | "isDirty"
                >,
              );
            }
            if (item.action === "update") {
              await mockApi.updateIssue(item.id, item.issue);
            }
            if (item.action === "resolve") {
              await mockApi.resolveIssue(item.id);
            }
            synced.push(item.id);
          } catch {
            // leave failed items in queue — try again next sync
          }
        }

        // remove successfully synced items, clear dirty flags
        set((s) => ({
          syncQueue: s.syncQueue.filter((i) => !synced.includes(i.id)),
          issues: s.issues.map((i) =>
            synced.includes(i.id)
              ? { ...i, isDirty: false, isLocalOnly: false }
              : i,
          ),
        }));
      },
      getFilteredIssues: () => {
        const { issues, filters } = get();

        return issues.filter((issue) => {
          const matchesSearch =
            filters.search.trim() === "" ||
            issue.title.toLowerCase().includes(filters.search.toLowerCase()) ||
            issue.description
              .toLowerCase()
              .includes(filters.search.toLowerCase());

          const matchesStatus =
            filters.status === "all" || issue.status === filters.status;

          const matchesPriority =
            filters.priority === "all" || issue.priority === filters.priority;

          return matchesSearch && matchesStatus && matchesPriority;
        });
      },
    }),
    {
      name: "issue-store",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        issues: state.issues,
        syncQueue: state.syncQueue,
        lastSynced: state.lastSynced,
      }),
    },
  ),
);
