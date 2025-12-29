import { WORKSPACE_INVITE_TEMPLATE } from "../lib/email-templates/workspace-invite.template";
import { WELCOME_EMAIL_TEMPLATE } from "../lib/email-templates/welcome-email.template";
import { USER_ADDED_TO_PROJECT_TEMPLATE } from "../lib/email-templates/user-added-to-project.template";
import { TASK_ASSIGNED_TEMPLATE } from "../lib/email-templates/task-assigned.template";
import { SYSTEM_NOTIFICATION_TEMPLATE } from "../lib/email-templates/general-system.template";

import { EmailType } from "./email.types";

export function renderEmail(type: EmailType, payload: any): string {
  switch (type) {
    case EmailType.WORKSPACE_INVITE:
      return WORKSPACE_INVITE_TEMPLATE(
        payload.workspaceName,
        payload.inviterName,
        payload.inviterEmail,
        payload.inviterAvatar,
        payload.workspaceAvatar,
        payload.inviteeName,
        payload.inviteeEmail,
        payload.inviteUrl
      );

    case EmailType.WELCOME:
      return WELCOME_EMAIL_TEMPLATE(
        payload.userName,
        payload.userEmail,
        payload.appUrl
      );

    case EmailType.PROJECT_ADDED:
      return USER_ADDED_TO_PROJECT_TEMPLATE(
        payload.userName,
        payload.projectName,
        payload.workspaceName,
        payload.addedByName,
        payload.projectUrl
      );

    case EmailType.TASK_ASSIGNED:
      return TASK_ASSIGNED_TEMPLATE(
        payload.assigneeName,
        payload.taskTitle,
        payload.projectName,
        payload.assignedBy,
        payload.taskUrl
      );

    case EmailType.SYSTEM:
      return SYSTEM_NOTIFICATION_TEMPLATE(
        payload.title,
        payload.message,
        payload.actionLabel,
        payload.actionUrl
      );

    default:
      throw new Error("Invalid email type");
  }
}
