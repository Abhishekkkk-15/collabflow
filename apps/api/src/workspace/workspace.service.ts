import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';
import { UpdateWorkspaceDto } from './dto/update-workspace.dto';
import { prisma } from '@collabflow/db';
import { createSlug } from '../common/utils/slug-helper';
import { User, Workspace } from '@prisma/client';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
@Injectable()
export class WorkspaceService {
  constructor(@InjectQueue('workspaceQueue') private workspaceQueue: Queue) {}

  async create(
    createWorkspaceDto: CreateWorkspaceDto,
    owner: User,
  ): Promise<Workspace> {
    const slug = createSlug(createWorkspaceDto.slug || createWorkspaceDto.name);
    console.log('current user', owner);
    const workspace = await prisma.workspace.create({
      data: {
        name: createWorkspaceDto.name,
        description: createWorkspaceDto.description,
        slug: slug,
        ownerId: owner.id,
        priority: createWorkspaceDto.priority,
        status: createWorkspaceDto.status,
        isActive:
          createWorkspaceDto.status === 'ARCHIVED' ||
          createWorkspaceDto.status === 'PAUSED',
      },
    });
    await prisma.workspaceMember.create({
      data: {
        userId: owner.id,
        role: 'OWNER',
        workspaceId: workspace.id,
      },
    });
    this.workspaceQueue.add('workspace:create', {
      workspace,
      members: createWorkspaceDto.members,
      invitedBy: owner,
    });

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

  async findOne(slug: string): Promise<Workspace> {
    try {
      if (!slug) throw new BadRequestException('Slug not provided');
      const workspace = await prisma.workspace.findUnique({
        where: {
          slug,
        },
        include: {
          projects: {
            select: {
              id: true,
              name: true,
              slug: true,
              ownerId: true,
              owner: {
                select: {
                  name: true,
                  image: true,
                  id: true,
                },
              },
            },
          },

          owner: {
            select: {
              id: true,
              name: true,
              image: true,
              email: true,
            },
          },

          members: {
            take: 5,
            select: {
              userId: true,
              role: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                  email: true,
                },
              },
            },
          },

          _count: {
            select: {
              members: true,
            },
          },
        },
      });
      if (!workspace) throw new NotFoundException('workspace not found');
      return workspace;
    } catch (error) {
      throw error;
    }
  }

  async update(slug: string, uDto: UpdateWorkspaceDto) {
    try {
      const ws = await this.findOne(slug);
      if (!ws) throw new NotFoundException('Workspace not found');
      const { members, ...rest } = uDto;
      return await prisma.workspace.update({
        where: {
          id: ws.id,
        },
        data: rest,
      });
    } catch (error) {
      throw error;
    }
  }

  async remove(slug: string) {
    try {
      const ws = await this.findOne(slug);
      if (!ws) throw new NotFoundException('Workspace not found');
      await prisma.workspace.delete({
        where: {
          id: ws.id,
        },
      });
      return { message: 'Workspace deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  async getWorkspaceMembers(slug: string, limit: number) {
    try {
      const ws = await prisma.workspace.findUnique({
        where: { slug },
        select: { id: true },
      });
      const count = await prisma.workspaceMember.count({
        where: {
          workspaceId: ws?.id,
        },
      });
      const members = await prisma.workspaceMember.findMany({
        where: {
          workspaceId: ws?.id,
        },
        include: {
          user: {
            select: { name: true, image: true, id: true, email: true },
          },
        },
      });
      if (!members) throw new NotFoundException('Members not found');
      return { members, count };
    } catch (error) {
      throw error;
    }
  }
}
