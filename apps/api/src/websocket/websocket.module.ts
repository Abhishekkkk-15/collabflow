import { Module } from '@nestjs/common';
import { WebsocketService } from './websocket.service';
import { WebsocketGateway } from './websocket.gateway';
import { chatWebsocketGateway } from './chat/chat.websocket.gateway';
import { ChatWSService } from './chat/chat.websocket.service';
import { ChatWSModule } from './chat/chat.websocket.module';
import { QueuesModule } from '../queues/queues.module';

@Module({
  imports: [ChatWSModule],
  providers: [WebsocketGateway, WebsocketService],
})
export class WebsocketModule {}
