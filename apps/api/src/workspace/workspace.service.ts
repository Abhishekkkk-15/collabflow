import {
  BadRequestException,
  ForbiddenException,
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
import { InviteWorkspaceDto } from './dto/invite.workspace.dto';
import { ChangeRoleDto } from './dto/change-role';
import { UpdatePermissinDto } from './dto/update-permission.dto';
import { ChatService } from '../chat/chat.service';
@Injectable()
export class WorkspaceService {
  constructor(
    @InjectQueue('workspaceQueue') private workspaceQueue: Queue,
    private readonly chatService: ChatService,
  ) {}

  async create(
    createWorkspaceDto: CreateWorkspaceDto,
    owner: User,
  ): Promise<string | undefined> {
    let workspace;
    const slug = createSlug(createWorkspaceDto.slug || createWorkspaceDto.name);
    prisma.$transaction(async (tx) => {
      console.log('current user', owner);
      workspace = await tx.workspace.create({
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
      await tx.workspacePermission.create({
        data: {
          workspaceId: workspace.id,
        },
      });
      await tx.workspaceMember.create({
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
    });
    return slug!;
  }

  async findAllWSForOwnerAndMaintainer(user: User) {
    console.log('request');
    return await prisma.workspace.findMany({
      where: {
        OR: [
          {
            members: {
              some: {
                AND: [{ userId: user.id }, { role: 'OWNER' }],
              },
            },
          },
          {
            members: {
              some: {
                AND: [{ userId: user.id }, { role: 'MAINTAINER' }],
              },
            },
          },
        ],
      },
      include: {
        projects: true,
        permissions: true,
      },
    });
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

  async findOne(slug: string, user?: User): Promise<any> {
    try {
      console.log('slug', slug);
      if (!slug) throw new BadRequestException('Slug not provided');
      const workspace = await prisma.workspace.findUnique({
        where: { slug },
        include: {
          projects: {
            select: {
              id: true,
              name: true,
              slug: true,
              ownerId: true,
              owner: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
              _count: {
                select: {
                  tasks: true,
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
              projects: true,
            },
          },
        },
      });
      const unReadCount = await this.chatService.getUnreadCount(
        user?.id!,
        `workspace:${workspace?.slug}`,
      );
      console.log('unread count', user?.id, unReadCount);
      if (!workspace) throw new NotFoundException('workspace not found');
      return { ...workspace, unReadCount: unReadCount };
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

  async getWorkspaceMembers(
    id: string,
    limit = 10,
    cursor: string,
    query: string,
  ) {
    const ws = await prisma.workspace.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      select: { id: true },
    });
    if (!limit) limit = 10;
    if (!ws) {
      throw new NotFoundException('Workspace not found');
    }

    const [members, count] = await prisma.$transaction([
      prisma.workspaceMember.findMany({
        where: {
          workspaceId: ws.id,
          ...(query?.trim()
            ? {
                OR: [
                  {
                    user: {
                      email: {
                        contains: query,
                        mode: 'insensitive',
                      },
                    },
                  },
                  {
                    user: {
                      name: {
                        contains: query,
                        mode: 'insensitive',
                      },
                    },
                  },
                ],
              }
            : {}),
        },
        take: limit,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          joinedAt: 'asc',
        },
        include: {
          user: {
            select: { id: true, name: true, email: true, image: true },
          },
        },
      }),
      prisma.workspaceMember.count({
        where: { workspaceId: ws.id },
      }),
    ]);
    const hasNextPage = members.length > limit;
    if (hasNextPage) {
      members.pop();
    }
    const nextCursor =
      members.length > 0 ? members[members.length - 1].id : null;

    let users = members.map((m) => ({ ...m.user, role: m.role }));
    return { members: users, hasNextPage, nextCursor, totalPage: count };
  }

  async findOneById(id: string) {
    return await prisma.workspace.findUnique({
      where: {
        id,
      },
      include: {
        permissions: true,
      },
    });
  }

  async changeRoles(dto: ChangeRoleDto, user: User) {
    const ws = await this.findOneById(dto.workspaceId);
    if (ws?.ownerId != user.id)
      throw new ForbiddenException('Not permited to perform this task');
    let m = await prisma.workspaceMember.findFirst({
      where: {
        userId: dto.id,
      },
    });

    console.log(ws, dto, m);
    await prisma.workspaceMember.update({
      where: {
        id: m!.id,
      },
      data: {
        role: dto.role,
      },
    });
    return { success: true };
  }

  async changePermissions(workspaceId: string, dto: UpdatePermissinDto) {
    const ws = await this.findOneById(workspaceId);
    if (!ws) throw new NotFoundException('Workspace not found');
    await prisma.workspacePermission.update({
      where: {
        workspaceId: workspaceId,
      },
      data: dto,
    });
  }

  async removeMember(id: string) {
    await prisma.workspaceMember.delete({
      where: {
        id,
      },
    });
  }
}
