import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { prisma } from '@collabflow/db';
import { ETaskTag, Task, TaskStatus } from '@collabflow/types';
import { Project, TaskTag, User } from '@prisma/client';
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
    return prisma.$transaction(async (tx) => {
      const task = await tx.task.create({
        data: {
          title: dto.title,
          description: dto.description,
          tags: dto.tags as any,
          status: dto.status as TaskStatus,
          priority: dto.priority,
          dueDate: dto.dueDate,
          creatorId: user.id,
          workspaceId: dto.workspaceId, // MUST NOT be undefined
          projectId: dto.projectId ?? null,
          assignees: {
            createMany: {
              data: dto.assignedTo.map((id: string) => ({ userId: id })),
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

      await this.taskQueue.add('task:notify', {
        workspaceId: task.workspaceId,
        projectId: task.projectId,
        assignedBy: user,
        assignedTo: dto.assignedTo,
        task: task,
      });

      return task;
    });
  }

  async findAll(wsSlug: string, pSlug: string) {
    const ws = await this.wsService.findOne(wsSlug);
    if (!ws) throw new BadGatewayException('Not found');

    let pr: Project | any;

    if (pSlug) {
      pr = await this.pService.findOne('', pSlug);
      if (!pr) throw new BadGatewayException('Not found');
    }
    let tasks;
    if (pSlug) {
      tasks = await prisma.task.findMany({
        where: {
          AND: [{ workspaceId: ws.id }, { projectId: pr.id }],
        },
        include: {
          assignees: {
            select: {
              user: {
                select: {
                  name: true,
                  image: true,
                  email: true,
                  id: true,
                },
              },
            },
          },
        },
        orderBy: {
          dueDate: 'desc',
        },
      });

      if (!tasks) throw new NotFoundException('Tasks not found');
      return tasks;
    }
    tasks = await prisma.task.findMany({
      where: {
        workspaceId: ws.id,
      },
      include: {
        assignees: {
          select: {
            user: {
              select: {
                name: true,
                image: true,
                email: true,
                id: true,
              },
            },
          },
        },
      },
      orderBy: {
        dueDate: 'desc',
      },
    });
    if (!tasks) throw new NotFoundException('Tasks not found');
    return tasks;
  }

  async findOne(id: string) {
    const task = await prisma.task.findUnique({
      where: {
        id,
      },
    });
    if (!task) throw new NotFoundException('Task not found');
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

  async remove(id: string) {
    await prisma.task.delete({
      where: {
        id,
      },
    });
  }
}
