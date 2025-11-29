import { Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { QueuesModule } from '../queues/queues.module';

@Module({
  controllers: [WorkspaceController],
  providers: [WorkspaceService],
  imports: [QueuesModule],
})
export class WorkspaceModule {}
