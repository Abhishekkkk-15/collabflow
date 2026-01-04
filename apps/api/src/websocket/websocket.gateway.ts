import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { WebsocketService } from './websocket.service';
import { CreateWebsocketDto } from './dto/create-websocket.dto';
import { UpdateWebsocketDto } from './dto/update-websocket.dto';
import { Server, Socket } from 'socket.io';
import { prisma } from '@collabflow/db';
import { createClient } from 'redis';
import { ChatWSService } from './chat/chat.websocket.service';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },
})
export class WebsocketGateway {
  @WebSocketServer()
  io!: Server;
  constructor(
    private readonly websocketService: WebsocketService,
    private readonly chatSocketService: ChatWSService,
  ) {}

  async afterInit() {
    this.websocketService.setServer(this.io);
    this.chatSocketService.setServer(this.io);
    const sub = createClient({ url: process.env.REDIS_URL! });
    await sub.connect();

    await sub.subscribe('socket-events', (msg) => {
      const { event, room, payload } = JSON.parse(msg);
      console.log('socket evets', event, room, payload);
      this.io.to(room).emit(event, { event, payload });
    });
  }

  async handleConnection(socket: Socket) {
    const userId = socket.handshake.auth.userId;

    if (!userId) {
      console.log('Socket connected without userId');
    }
    console.log('userid', userId);
    this.websocketService.joinUserRoom(socket, userId);

    console.log(`User's connection has been made`);
    return `User's connection has been made`;
  }

  @SubscribeMessage('ws')
  testing() {
    return 'hey there from ws';
  }

  handleDisconnect(socket: Socket) {
    console.log('client disconnected', socket.id);
  }
}
