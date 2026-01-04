import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { QueuesModule } from '../queues/queues.module';
import { ChatModule } from '../chat/chat.module';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService],
  imports: [QueuesModule, ChatModule],
  exports: [ProjectService],
})
export class ProjectModule {}
