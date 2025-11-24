import { Injectable } from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { prisma } from '@collabflow/db';
import { createSlug } from '../common/utils/slug-helper';
import { Workspace } from '@collabflow/types';
@Injectable()
export class WorkspaceService {
  async create(createWorkspaceDto: CreateWorkspaceDto, ownerId: string) {
    const slug = createSlug(createWorkspaceDto.name);
    console.log('MEMBER', createWorkspaceDto.members);

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
      console.log('Workspace members getting created ', members);

      await prisma.workspaceMember.createMany({
        data: members,
      });
    }
    return workspace;
  }

  async findAll(ownerId: string): Promise<any> {
    return await prisma.workspace.findMany({
      where: {
        OR: [
          { ownerId: ownerId }, // user is the owner
          {
            members: {
              // user is a member
              some: { userId: ownerId },
            },
          },
        ],
      },
      include: {
        owner: true,
        members: true,
        projects: true,
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} workspace`;
  }

  update(id: number, updateWorkspaceDto: UpdateWorkspaceDto) {
    return `This action updates a #${id} workspace`;
  }

  remove(id: number) {
    return `This action removes a #${id} workspace`;
  }
}
