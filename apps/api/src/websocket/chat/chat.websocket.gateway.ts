import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatWSService } from './chat.websocket.service';
import { Namespace, Server, Socket } from 'socket.io';
import { prisma } from '@collabflow/db';
import { WebsocketGateway } from '../websocket.gateway';
@WebSocketGateway()
export class chatWebsocketGateway {
  constructor(
    private readonly websocketGateway: WebsocketGateway,
    private readonly chatService: ChatWSService,
  ) {}
  afterInit() {
    this.chatService.setServer(this.websocketGateway.io);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(@ConnectedSocket() socket: Socket, @MessageBody() body: any) {
    const { roomId } = body;
    console.log(`Socket ${socket.id} joining room`, roomId);
    socket.join(roomId);
  }
  @SubscribeMessage('send')
  handleMessages(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: any,
  ): any {
    return this.chatService.handleMessages(socket, body.payload);
  }

  @SubscribeMessage('typing')
  handleUserTyping(
    @ConnectedSocket() socket: Socket,
    @MessageBody() body: any,
  ) {
    return this.chatService.handleUserTyping(socket, body.payload);
  }
}
