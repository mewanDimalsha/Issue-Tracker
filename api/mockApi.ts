import { Issue } from "../types";
import { MOCK_ISSUES } from "./seeds";

const delay = (ms: number = 800) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const mayFail = () => {
  if (Math.random() < 0.1) {
    throw new Error("Network error. Please try again.");
  }
};

let db: Issue[] = [...MOCK_ISSUES];

export const mockApi = {
  async getIssues(): Promise<Issue[]> {
    await delay();
    mayFail();
    return [...db];
  },

  async createIssue(
    issue: Omit<
      Issue,
      "id" | "createdAt" | "updatedAt" | "isLocalOnly" | "isDirty"
    >,
  ): Promise<Issue> {
    await delay(600);
    mayFail();
    const newIssue = {
      ...issue,
      id: `issue_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db = [newIssue, ...db];
    return newIssue;
  },

  async updateIssue(id: string, updates: Partial<Issue>): Promise<Issue> {
    await delay(500);
    mayFail();
    const index = db.findIndex((issue) => issue.id === id);
    if (index === -1) {
      throw new Error(`Issue ${id} not found`);
    }
    const updatedIssue = {
      ...db[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    db = db.map((issue) => (issue.id === id ? updatedIssue : issue));
    return updatedIssue;
  },

  async resolveIssue(id: string): Promise<Issue> {
    await delay(400);
    mayFail();
    const index = db.findIndex((issue) => issue.id === id);
    if (index === -1) {
      throw new Error(`Issue ${id} not found`);
    }
    db = db.map((issue) =>
      issue.id === id
        ? {
            ...issue,
            status: "resolved",
            resolvedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        : issue,
    );
    const resolved = db.find((issue) => issue.id === id)!;
    return resolved;
  },
};
