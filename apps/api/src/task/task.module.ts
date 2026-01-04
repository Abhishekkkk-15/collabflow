import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { QueuesModule } from '../queues/queues.module';
import { ProjectService } from '../project/project.service';
import { WorkspaceService } from '../workspace/workspace.service';
import { ProjectModule } from '../project/project.module';
import { WorkspaceModule } from '../workspace/workspace.module';

@Module({
  controllers: [TaskController],
  providers: [TaskService],
  imports: [QueuesModule, ProjectModule, WorkspaceModule],
})
export class TaskModule {}
