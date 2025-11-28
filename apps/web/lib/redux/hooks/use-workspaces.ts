"use client";

import { useParams } from "next/navigation";
import type { TWorkspace, TProject } from "../slices/workspace";
import { useAppSelector } from "../hooks";

/**
 * Get all workspaces from Redux
 */
export function useWorkspaces(): TWorkspace[] {
  return useAppSelector((state: any) => state.workspace.workspaces);
}

/**
 * Get a workspace by slug
 */
export function useWorkspace(slug?: string): TWorkspace | undefined {
  const workspaces = useWorkspaces();
  if (!slug) return undefined;
  return workspaces.find((w) => w.slug === slug);
}

/**
 * Get workspace based on route params (/dashboard/[workspace])
 */
export function useActiveWorkspace(): TWorkspace | undefined {
  const params = useParams();
  const slug = params.workspace?.toString();
  return useWorkspace(slug);
}

/**
 * Get all projects belonging to the active workspace
 */
export function useWorkspaceProjects(): TProject[] {
  const activeWS = useActiveWorkspace();
  return activeWS?.projects ?? [];
}

/**
 * Get a specific project from active workspace (/dashboard/[workspace]/[project])
 */
export function useActiveProject(): TProject | undefined {
  const params = useParams();
  const projectSlug = params.project?.toString();
  const activeWS = useActiveWorkspace();
  return activeWS?.projects?.find((p) => p.slug === projectSlug);
}
