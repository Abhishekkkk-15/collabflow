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
  return useAppSelector((state: any) => state.user.user);
}
export function useRolesforProject(id: string): UserProjectRoles | undefined {
  if (!id) return;
  const { userRoles } = useUserDetails();
  if (!userRoles.projectRoles) return;
  return userRoles?.projectRoles.find((p) => p.id === id);
}

export function useRolesforWs(id: string): UserWorkspaceRoles | undefined {
  if (!id) return;
  const { userRoles } = useUserDetails();
  if (!userRoles) return;
  return userRoles?.workspaceRoles.find((ws) => ws.id === id);
}
