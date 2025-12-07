export type WorkspaceRole = "OWNER" | "MAINTAINER" | "CONTRIBUTOR" | "VIEWER";
export type ProjectRole = "OWNER" | "MAINTAINER" | "CONTRIBUTOR" | "VIEWER";
export type UserRole = "USER" | "ADMIN";
export type NotificationType =
  | "GENERAL"
  | "INVITE"
  | "MENTION"
  | "TASK_ASSIGNED"
  | "TASK_UPDATED"
  | "PROJECT_UPDATED"
  | "SYSTEM";
export type Status = "Todo" | "In Progress" | "Blocked" | "Done" | "Canceled";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE" | "BLOCKED";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type TaskTag =
  | "BUG"
  | "FEATURE"
  | "IMPROVEMENT"
  | "REFACTOR"
  | "DESIGN"
  | "DOCUMENTATION"
  | "FRONTEND"
  | "BACKEND"
  | "DATABASE"
  | "SECURITY"
  | "PERFORMANCE";
export enum ETaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  BLOCKED = "BLOCKED",
  DONE = "DONE",
  REVIEW = "REVIEW",
}

export enum ETaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  URGENT = "URGENT",
}

export enum ETaskTag {
  BUG = "BUG",
  FEATURE = "FEATURE",
  IMPROVEMENT = "IMPROVEMENT",
  REFACTOR = "REFACTOR",
  DESIGN = "DESIGN",
  DOCUMENTATION = "DOCUMENTATION",
  FRONTEND = "FRONTEND",
  BACKEND = "BACKEND",
  DATABASE = "DATABASE",
  SECURITY = "SECURITY",
  PERFORMANCE = "PERFORMANCE",
}
