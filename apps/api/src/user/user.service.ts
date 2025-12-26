import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { prisma } from '@collabflow/db';
import { Account, UserRole } from '@collabflow/types';
import { User } from '@prisma/client';
@Injectable()
export class UserService {
  create(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }
  async findAll(
    currentUser: User,
    limit = 10,
    cursor?: string,
    query?: string,
  ): Promise<{
    members: User[];
    hasNextPage: boolean;
    nextCursor: string | null;
  }> {
    const users = await prisma.user.findMany({
      where: {
        NOT: {
          id: currentUser.id,
        },
        ...(query?.trim()
          ? {
              OR: [
                {
                  name: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
                {
                  email: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
              ],
            }
          : {}),
      },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      orderBy: {
        id: 'asc',
      },
    });
    const hasNextPage = users.length > limit;
    if (hasNextPage) {
      users.pop();
    }
    const nextCursor = users.length > 0 ? users[users.length - 1].id : null;

    return { members: users, hasNextPage, nextCursor };
  }

  async findAllUserNotInWs(
    id: string,
    limit = 10,
    cursor?: string,
    query?: string,
  ) {
    const wsExist = await prisma.workspace.findUnique({
      where: {
        id,
      },
    });
    if (!wsExist) throw new NotFoundException('Workspace not found');
    const users = await prisma.user.findMany({
      where: {
        workspaceMemberships: {
          none: {
            workspaceId: wsExist.id,
          },
        },
        ...(query?.trim()
          ? {
              OR: [
                {
                  email: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
                {
                  name: {
                    contains: query,
                    mode: 'insensitive',
                  },
                },
              ],
            }
          : {}),
      },
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: query ? 0 : cursor ? 1 : 0,
      orderBy: {
        id: 'asc',
      },
    });
    const hasNextPage = users.length > limit;
    if (hasNextPage) {
      users.pop();
    }
    const nextCursor = users.length > 0 ? users[users.length - 1].id : null;
    console.log('users', users);
    return { users, hasNextPage, nextCursor };
  }
  async findAllUserNotInP(pId: string) {
    const wsExist = await prisma.project.findUnique({
      where: {
        id: pId,
      },
    });
    if (!wsExist) throw new NotFoundException('Project not found');
    return await prisma.user.findMany({
      where: {
        NOT: {
          projectMemberships: {
            some: {
              projectId: pId,
            },
          },
        },
      },
    });
  }
  async currentUserRoles(id: string) {
    try {
      const workspaceRoles = await prisma.workspaceMember.findMany({
        where: {
          userId: id,
        },
        select: {
          id: true,
          role: true,
          workspaceId: true,
        },
      });
      const projectRoles = await prisma.projectMember.findMany({
        where: {
          userId: id,
        },
        select: {
          id: true,
          meta: true,
          role: true,
          projectId: true,
        },
      });
      return { workspaceRoles, projectRoles };
    } catch (error) {
      console.log(error);
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
