import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { prisma } from '@collabflow/db';
import { createSlug } from '../common/utils/slug-helper';
import { Workspace } from '@prisma/client';
@Injectable()
export class WorkspaceService {
  async create(
    createWorkspaceDto: CreateWorkspaceDto,
    ownerId: string,
  ): Promise<Workspace> {
    const slug = createSlug(createWorkspaceDto.slug || createWorkspaceDto.name);

    const workspace = await prisma.workspace.create({
      data: {
        name: createWorkspaceDto.name,
        description: createWorkspaceDto.description,
        slug: slug,
        ownerId,
      },
    });
    await prisma.workspaceMember.create({
      data: {
        userId: ownerId,
        role: 'OWNER',
        workspaceId: workspace.id,
      },
    });

    if (
      createWorkspaceDto?.members != undefined &&
      createWorkspaceDto.members.length > 0
    ) {
      const members = createWorkspaceDto.members.map((m) => ({
        ...m,
        workspaceId: workspace.id,
      }));

      await prisma.workspaceMember.createMany({
        data: members,
      });
    }
    return workspace;
  }

  async findAll(ownerId: string): Promise<any> {
    const workspaces = await prisma.workspace.findMany({
      where: {
        OR: [
          { ownerId },
          {
            members: {
              some: { userId: ownerId },
            },
          },
        ],
      },
      select: {
        id: true,
        slug: true,
        name: true,
        ownerId: true,
        projects: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        owner: {
          select: {
            name: true,
            id: true,
            image: true,
            email: true,
          },
        },
      },
    });

    return { workspaces };
  }

  async getWorkspaceMembers(id: string) {
    const members = await prisma.workspaceMember.findMany({
      where: {
        workspaceId: id,
      },
      include: {
        user: {
          select: { name: true, image: true, id: true, email: true },
        },
      },
      take: 8,
    });
    console.log(members);
    if (!members) throw new NotFoundException('Members not found');
    return members;
  }
}
