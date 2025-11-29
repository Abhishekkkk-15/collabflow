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

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },
})
export class WebsocketGateway {
  @WebSocketServer()
  io!: Server;
  constructor(private readonly websocketService: WebsocketService) {}

  async afterInit() {
    this.websocketService.setServer(this.io);
    const sub = createClient({ url: 'redis://localhost:6379' });
    await sub.connect();

    await sub.subscribe('socket-events', (msg) => {
      const { event, room, payload } = JSON.parse(msg);
      console.log('socket evets', event, room, payload);
      this.io.to(room).emit(event, payload);
    });
  }

  async handleConnection(socket: Socket) {
    const userId = socket.handshake.auth.userId;

    if (!userId) {
      console.log('Socket connected without userId');
    }
    console.log('userid', userId);
    this.websocketService.joinUserRoom(socket, userId);

    const workspaces = await prisma.workspace.findMany({
      where: {
        OR: [{ ownerId: userId }, { members: { some: { userId } } }],
      },
      select: { id: true },
    });
    if (workspaces) {
      workspaces.forEach((ws) => {
        this.websocketService.joinWorkspaceRoom(socket, ws.id);
      });

      const projects = await prisma.project.findMany({
        where: {
          OR: [{ ownerId: userId }, { members: { some: { userId } } }],
        },
        select: { id: true },
      });
      if (projects) {
        projects.forEach((p) => {
          this.websocketService.joinProjectRoom(socket, p.id);
        });
      }
      console.log(`User's connection has been made`);
      return `User's connection has been made`;
    }
  }

  @SubscribeMessage('ws')
  testing() {
    return 'hey there from ws';
  }

  handleDisconnect(socket: Socket) {
    console.log('client disconnected', socket.id);
  }
}
