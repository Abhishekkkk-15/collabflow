import { QueuesModule } from '../../queues/queues.module';
import { Module } from '@nestjs/common';
import { ChatWSService } from './chat.websocket.service';
import { chatWebsocketGateway } from './chat.websocket.gateway';

@Module({
  imports: [QueuesModule],
  providers: [ChatWSService, chatWebsocketGateway],
  exports: [ChatWSService],
})
export class ChatModule {}
