import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WorkspaceModule } from './workspace/workspace.module';
import { ProjectModule } from './project/project.module';
import { UserModule } from './user/user.module';
import { NotificationModule } from './notification/notification.module';
import { WebsocketModule } from './websocket/websocket.module';
import { NextFunction } from 'express';
import { CurrentMiddleaware } from './common/middleware/current-user.middleware';
import { QueuesModule } from './queues/queues.module';
import { BullModule } from '@nestjs/bullmq';
import { TaskModule } from './task/task.module';
import { InviteModule } from './invite/invite.module';
import { ChatModule } from './websocket/chat/chat.module';
@Module({
  imports: [
    WorkspaceModule,
    ProjectModule,
    UserModule,
    NotificationModule,
    WebsocketModule,
    QueuesModule,
    BullModule,
    TaskModule,
    InviteModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CurrentMiddleaware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
