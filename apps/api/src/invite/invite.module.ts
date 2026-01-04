import { Module } from '@nestjs/common';
import { InviteService } from './invite.service';
import { InviteController } from './invite.controller';
import { NotificationService } from '../notification/notification.service';
import { QueuesModule } from '../queues/queues.module';
import { WorkspaceService } from '../workspace/workspace.service';
import { ProjectService } from '../project/project.service';
import { NotificationModule } from '../notification/notification.module';
import { WorkspaceModule } from '../workspace/workspace.module';
import { ProjectModule } from '../project/project.module';

@Module({
  controllers: [InviteController],
  providers: [InviteService],
  imports: [QueuesModule, NotificationModule, WorkspaceModule, ProjectModule],
})
export class InviteModule {}
