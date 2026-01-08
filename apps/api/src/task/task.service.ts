import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { prisma } from '@collabflow/db';
import { TaskStatus } from '@collabflow/types';
import { User } from '@prisma/client';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ProjectService } from '../project/project.service';
import { WorkspaceService } from '../workspace/workspace.service';
@Injectable()
export class TaskService {
  constructor(
    @InjectQueue('taskQueue') private taskQueue: Queue,
    private pService: ProjectService,
    private wsService: WorkspaceService,
  ) {}

  async create(dto: CreateTaskDto, user: User) {
    const project = await prisma.project.findFirst({
      where: {
        OR: [{ id: dto.projectId! }, { slug: dto.projectId! }],
      },
    });
    const task = await prisma.$transaction(async (tx) => {
      if (!project) throw new NotFoundException('Project not found');
      const task = await tx.task.create({
        data: {
          title: dto.title,
          description: dto.description,
          tags: dto.tags as any,
          status: dto.status as TaskStatus,
          priority: dto.priority,
          dueDate: dto.dueDate,
          creatorId: user.id,
          workspaceId: project.workspaceId,
          projectId: project.id,
          assignees: {
            createMany: {
              data: dto.assignedTo.map((u: any) => ({ userId: u.id })),
            },
          },
        },
        include: {
          assignees: {
            include: {
              user: {
                select: {
                  name: true,
                  image: true,
                  id: true,
                },
              },
            },
          },
        },
      });

      return task;
    });
    await this.taskQueue.add('task:notify', {
      workspaceId: task.workspaceId,
      projectId: task.projectId,
      assignedBy: user,
      assignedTo: dto.assignedTo,
      task: task,
      project: project,
      workspace: await this.wsService.findOneById(task.workspaceId),
    });
    return task;
  }

  async findAll(
    workspaceId: string,
    pSlug: string,
    limit = 10,
    page = 1,
    query = '',
    user: User,
  ) {
    if (!limit) limit = 10;
    const ws = await this.wsService.findOne(workspaceId, user);
    if (!ws) throw new BadGatewayException('Workspace not found');

    let project: any;

    if (pSlug) {
      project = await prisma.project.findFirst({
        where: {
          OR: [{ id: pSlug }, { slug: pSlug }],
        },
      });
      if (!project) throw new BadGatewayException('Project not found');
    }

    const whereClause: any = {
      workspaceId: ws.id,
      ...(project && { projectId: project.id }),
      ...(query && {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
        ],
      }),
    };

    const totalCount = await prisma.task.count({
      where: whereClause,
    });

    const totalPages = Math.ceil(totalCount / limit);

    const tasks = await prisma.task.findMany({
      where: whereClause,
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        dueDate: 'desc',
      },
      include: {
        assignees: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        workspace: {
          select: {
            slug: true,
          },
        },
        project: {
          select: {
            slug: true,
          },
        },
      },
    });
    console.log('tasks', tasks);
    return {
      tasks,
      page,
      limit,
      totalCount,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  }

  async findOne(id: string) {
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        assignees: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        workspace: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async update(id: string, uDto: UpdateTaskDto) {
    try {
      return await prisma.task.update({
        where: { id },
        data: uDto,
      });
    } catch (err: any) {
      if (err.code === 'P2025') {
        throw new NotFoundException('Task not found');
      }
      throw err;
    }
  }

  async remove(body: { ids: string[] }) {
    console.log('checked tasks');
    return await prisma.task.deleteMany({
      where: {
        id: {
          in: body.ids,
        },
      },
    });
  }

  async removeSingle(id: string) {
    return await prisma.task.delete({
      where: {
        id,
      },
    });
  }
}
