import { QueuesModule } from '../../queues/queues.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [QueuesModule],
})
export class ChatModule {}
