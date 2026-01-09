import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { CurrentUser } from '../common/decorator/current-user.decorator';
import type { User } from '@prisma/client';
import { prisma } from '@collabflow/db';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @CurrentUser() user: User) {
    console.log(createTaskDto);
    return this.taskService.create(createTaskDto, user);
  }

  @Get()
  findAll(
    @Query('wsSlug') wsSlug: string,
    @Query('pSlug') pSlug: string,
    @Query('limit') limit: string,
    @Query('page') page: string,
    @Query('q') query: string,
    @CurrentUser() user: User,
  ) {
    return this.taskService.findAll(wsSlug, pSlug, +limit, +page, query, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(id);
  }

  @Post(':id/activity')
  async updateWithActivity(
    @Param('id') id: string,
    @Body() uDto: UpdateTaskDto,
    @CurrentUser() user: User,
  ) {
    const { note } = uDto;

    const data = {
      title: uDto.title,
      description: uDto.description,
      tags: uDto.tags,
      status: uDto.status,
      priority: uDto.priority,
      dueDate: uDto.dueDate,
    };
    const oldTask = await prisma.task.findUnique({
      where: { id },
    });

    if (!oldTask) {
      throw new NotFoundException('Task not found');
    }

    const isAssigned = await prisma.taskAssignee.findUnique({
      where: {
        taskId_userId: {
          taskId: id,
          userId: user.id,
        },
      },
    });

    if (!isAssigned) {
      throw new ForbiddenException('You are not assigned to this task');
    }
    const updatedTask = await this.taskService.update(id, data);

    const activities: any[] = [];

    if (uDto.status && uDto.status !== oldTask.status) {
      activities.push({
        taskId: id,
        userId: user.id,
        field: 'status',
        oldValue: oldTask.status,
        newValue: uDto.status,
      });
    }

    if (uDto.priority && uDto.priority !== oldTask.priority) {
      activities.push({
        taskId: id,
        userId: user.id,
        field: 'priority',
        oldValue: oldTask.priority,
        newValue: uDto.priority,
      });
    }

    if (note) {
      activities.push({
        taskId: id,
        userId: user.id,
        field: 'note',
        newValue: note,
      });
    }

    if (activities.length > 0) {
      await prisma.taskActivity.createMany({
        data: activities,
      });
    }

    return updatedTask;
  }

  @Delete('/multi')
  remove(@Body() body: { ids: string[] }) {
    console.log('mi', body);
    return this.taskService.remove(body);
  }
  @Delete(':id')
  removeSingle(@Param('id') id: string) {
    return this.taskService.removeSingle(id);
  }
}
