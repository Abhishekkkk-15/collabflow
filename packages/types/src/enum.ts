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
export type Status = "Todo" | "In Progress" | "Backlog" | "Done" | "Canceled";
export type TaskPriority = "All" | "Low" | "Medium" | "High";
