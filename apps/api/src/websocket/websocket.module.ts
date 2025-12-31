import { Module } from '@nestjs/common';
import { WebsocketService } from './websocket.service';
import { WebsocketGateway } from './websocket.gateway';
import { chatWebsocketGateway } from './chat/chat.websocket.gateway';
import { ChatWSService } from './chat/chat.websocket.service';
import { ChatModule } from './chat/chat.module';
import { QueuesModule } from '../queues/queues.module';

@Module({
  imports: [ChatModule],
  providers: [WebsocketGateway, WebsocketService],
})
export class WebsocketModule {}
