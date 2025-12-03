import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
@Module({
  imports: [
    BullModule.forRoot({
      connection: { host: 'localhost', port: 6379 },
    }),
    BullModule.registerQueue(
      { name: 'workspaceQueue' },
      { name: 'inviteQueue' },
      { name: 'emailQueue' },
      { name: 'notificationQueue' },
      { name: 'projectQueue' },
    ),
  ],
  exports: [BullModule],
})
export class QueuesModule {}
