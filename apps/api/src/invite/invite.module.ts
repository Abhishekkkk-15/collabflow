import { Module } from '@nestjs/common';
import { InviteService } from './invite.service';
import { InviteController } from './invite.controller';
import { NotificationService } from '../notification/notification.service';
import { QueuesModule } from '../queues/queues.module';
import { WorkspaceService } from '../workspace/workspace.service';
import { ProjectService } from '../project/project.service';

@Module({
  controllers: [InviteController],
  providers: [
    InviteService,
    NotificationService,
    WorkspaceService,
    ProjectService,
  ],
  imports: [QueuesModule],
})
export class InviteModule {}
