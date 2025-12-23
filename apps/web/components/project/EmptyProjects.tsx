// import { IconFolderCode } from "@tabler/icons-react";
import { FolderIcon } from "lucide-react";
import { ArrowUpRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { CreateProjectDialog } from "../self/CreateProjectDialog";
import { useState } from "react";
import { useSelector } from "react-redux";

export function EmptyDemo({
  workspaceId,
  disabled,
}: {
  workspaceId: string;
  disabled: boolean;
}) {
  const [openCreateProject, setOpenCreateProject] = useState(false);

  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderIcon />
        </EmptyMedia>
        <EmptyTitle>No Projects Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any projects yet. Get started by creating
          your first project.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button
            onClick={() => setOpenCreateProject(true)}
            disabled={disabled}>
            Create Project
          </Button>
          <CreateProjectDialog
            workspaceId={workspaceId}
            open={openCreateProject}
            onOpenChange={setOpenCreateProject}
          />
        </div>
      </EmptyContent>
    </Empty>
  );
}
