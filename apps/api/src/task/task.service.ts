import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { prisma } from '@collabflow/db';
import { ETaskTag, Task, TaskStatus } from '@collabflow/types';
import { TaskTag, User } from '@prisma/client';
@Injectable()
export class TaskService {
  async create(dto: CreateTaskDto, user: User) {
    console.log('u', dto.workspaceId);
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

      return task;
    });
  }

  findAll() {
    return `This action returns all task`;
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}
