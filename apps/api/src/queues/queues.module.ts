import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
@Module({
  imports: [
    BullModule.forRoot({
      connection: { url: process.env.REDIS_URL! },
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
