import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { ChatWSService } from './chat.websocket.service';
import { Socket } from 'socket.io';
@WebSocketGateway()
export class chatWebsocketGateway {
  constructor(private readonly chatService: ChatWSService) {}

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
