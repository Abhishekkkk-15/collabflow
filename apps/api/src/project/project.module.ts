import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { QueuesModule } from '../queues/queues.module';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService],
  imports: [QueuesModule],
  exports: [ProjectService],
})
export class ProjectModule {}
