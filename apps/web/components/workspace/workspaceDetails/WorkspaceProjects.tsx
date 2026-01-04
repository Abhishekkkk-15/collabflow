"use client";

import ProjectCard from "./ProjectCard";
import { EmptyDemo } from "../../project/EmptyProjects";

interface WorkspaceProjectsProps {
  workspace: any;
  isRestricted: boolean;
}

export default function WorkspaceProjects({
  workspace,
  isRestricted,
}: WorkspaceProjectsProps) {
  const hasProjects = (workspace.projects || []).length > 0;

  return (
    <section className="space-y-3">
      {hasProjects ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {workspace.projects.map((project: any) => (
            <ProjectCard
              key={project.id}
              project={project}
              workspaceSlug={workspace.slug!}
              isRestricted={isRestricted}
            />
          ))}
        </div>
      ) : (
        <div className="border bg-card rounded-xl p-6 grid place-items-center">
          {!isRestricted && (
            <EmptyDemo
              disabled={workspace.project}
              workspaceId={workspace.id}
            />
          )}
        </div>
      )}
    </section>
  );
}
