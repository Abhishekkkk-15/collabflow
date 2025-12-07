import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { QueuesModule } from '../queues/queues.module';
import { ProjectService } from '../project/project.service';
import { WorkspaceService } from '../workspace/workspace.service';

@Module({
  controllers: [TaskController],
  providers: [TaskService, ProjectService, WorkspaceService],
  imports: [QueuesModule],
})
export class TaskModule {}
