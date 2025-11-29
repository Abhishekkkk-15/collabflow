"use client";

import { User } from "@prisma/client";
import { useAppSelector } from "../hooks";
import {
  UserProjectRoles,
  UserState,
  UserWorkspaceRoles,
} from "../slices/userSlice";

export function useUserDetails() {
  const user = useUser();
  const userRoles = useUserRoles();
  return { user, userRoles };
}

export function useUser(): User {
  return useAppSelector((state: any) => state.user.user);
}
// workspaceRoles, projectRoles
export function useUserRoles(): {
  workspaceRoles: UserWorkspaceRoles[];
  projectRoles: UserProjectRoles[];
} {
  return useAppSelector((state: any) => state.user.userRoles);
}
export function useRolesforProject(id: string): UserProjectRoles | undefined {
  const { userRoles } = useUserDetails();
  if (!id) return;
  if (!userRoles.projectRoles) return;
  return userRoles?.projectRoles.find((p) => p.projectId === id);
}

export function useRolesforWs(id: string): UserWorkspaceRoles | undefined {
  const { userRoles } = useUserDetails();
  if (!id) return;
  if (!userRoles.workspaceRoles) return;
  return userRoles?.workspaceRoles.find((ws) => ws.workspaceId == id);
}
