import { Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { QueuesModule } from '../queues/queues.module';
import { ChatModule } from '../chat/chat.module';

@Module({
  controllers: [WorkspaceController],
  providers: [WorkspaceService],
  imports: [QueuesModule, ChatModule],
  exports: [WorkspaceService],
})
export class WorkspaceModule {}
