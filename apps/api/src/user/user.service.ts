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

  async findAllUserNotInP(
    pId: string,
    limit: number,
    cursor: string,
    query: string,
  ) {
    const wsExist = await prisma.project.findUnique({
      where: {
        id: pId,
      },
    });
    if (!wsExist) throw new NotFoundException('Project not found');
    const users = await prisma.user.findMany({
      where: {
        NOT: {
          projectMemberships: {
            some: {
              projectId: pId,
            },
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
    });
    const hasNextPage = users.length > limit;
    if (hasNextPage) {
      users.pop();
    }
    const nextCursor = users.length > 0 ? users[users.length - 1].id : null;
    console.log('users', users);
    return { users, hasNextPage, nextCursor };
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
  async getMyDashboard(userId: string) {
    const now = new Date();
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const assignedTasks = await prisma.task.findMany({
      where: {
        assignees: {
          some: { userId },
        },
        status: { not: 'DONE' },
      },
      select: {
        id: true,
        title: true,
        status: true,
        priority: true,
        dueDate: true,
        project: { select: { id: true, name: true } },
      },
    });

    const stats = {
      assigned: assignedTasks.length,
      dueToday: assignedTasks.filter(
        (t) => t.dueDate && t.dueDate <= endOfToday,
      ).length,
      overdue: assignedTasks.filter((t) => t.dueDate && t.dueDate < now).length,
      urgent: assignedTasks.filter((t) => t.priority === 'URGENT').length,
    };

    const todayTasks = assignedTasks.filter(
      (t) => t.dueDate && t.dueDate <= endOfToday,
    );

    const upcomingTasks = assignedTasks.filter(
      (t) => t.dueDate && t.dueDate > endOfToday,
    );

    const urgentTasks = assignedTasks.filter((t) => t.priority === 'URGENT');

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        body: true,
        type: true,
        isRead: true,
        createdAt: true,
      },
    });

    const taskIds = assignedTasks.map((t) => t.id);

    const recentTaskActivities = await prisma.taskActivity.findMany({
      where: {
        taskId: { in: taskIds },
      },
      orderBy: { createdAt: 'desc' },
      take: 6,
      select: {
        id: true,
        field: true,
        oldValue: true,
        newValue: true,
        createdAt: true,
        task: { select: { title: true } },
        user: { select: { name: true } },
      },
    });

    const activityFeed = recentTaskActivities.map((a) => ({
      id: a.id,
      message: a.user
        ? `${a.user.name} updated ${a.task.title} (${a.field})`
        : `Task updated: ${a.task.title}`,
      createdAt: a.createdAt,
    }));

    return {
      stats,
      todayTasks,
      upcomingTasks,
      urgentTasks,
      notifications,
      recentTaskActivities: activityFeed,
    };
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
