import { Module } from '@nestjs/common';
import { WebsocketService } from './websocket.service';
import { WebsocketGateway } from './websocket.gateway';
import { chatWebsocketGateway } from './chat/chat.websocket.gateway';
import { ChatWSService } from './chat/chat.websocket.service';
import { ChatModule } from './chat/chat.module';
import { QueuesModule } from '../queues/queues.module';

@Module({
  providers: [
    WebsocketGateway,
    WebsocketService,
    chatWebsocketGateway,
    ChatWSService,
  ],
  exports: [WebsocketService, ChatWSService],
  imports: [ChatModule, QueuesModule],
})
export class WebsocketModule {}
