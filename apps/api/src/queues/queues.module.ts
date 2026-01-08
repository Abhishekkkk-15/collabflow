import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { redis } from '../common/config/redis.pubsub';
@Module({
  imports: [
    BullModule.forRoot({
      connection: redis,
      telemetry: undefined,
    }),
    BullModule.registerQueue(
      { name: 'workspaceQueue' },
      { name: 'inviteQueue' },
      { name: 'emailQueue' },
      { name: 'notificationQueue' },
      { name: 'projectQueue' },
      { name: 'taskQueue' },
      { name: 'chatQueue' },
    ),
  ],
  exports: [BullModule],
})
export class QueuesModule {}
