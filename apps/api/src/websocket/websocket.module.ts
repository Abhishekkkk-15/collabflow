import { Module } from '@nestjs/common';
import { WebsocketService } from './websocket.service';
import { WebsocketGateway } from './websocket.gateway';
import { chatWebsocketGateway } from './chat/chat.websocket.gateway';
import { ChatWSService } from './chat/chat.websocket.service';

@Module({
  providers: [
    WebsocketGateway,
    WebsocketService,
    chatWebsocketGateway,
    ChatWSService,
  ],
  exports: [WebsocketService, ChatWSService],
})
export class WebsocketModule {}
