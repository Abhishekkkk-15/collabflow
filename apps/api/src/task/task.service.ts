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
      const project = await this.pService.findOne(
        dto.projectId!,
        dto.projectId!,
      );
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

  async findAll(
    workspaceId: string,
    pSlug: string,
    limit = 10,
    page = 1,
    query = '',
  ) {
    if (!limit) limit = 10;
    const ws = await this.wsService.findOne(workspaceId);
    if (!ws) throw new BadGatewayException('Workspace not found');

    let project: Project | null = null;

    if (pSlug) {
      project = await this.pService.findOne('', pSlug);
      if (!project) throw new BadGatewayException('Project not found');
    }
    console.log('query', query);

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
      },
    });

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
