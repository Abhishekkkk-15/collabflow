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

  afterInit() {
    this.websocketService.setServer(this.io);
    console.log('Socket.io Initialized');
  }

  async handleConnection(socket: Socket) {
    const userId = socket.handshake.auth.userId;

    if (!userId) {
      console.log('Socket connected without userId');
    }

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
      return `User's connection has been made`;
    }
  }

  handleDisconnect(socket: Socket) {
    console.log('client disconnected', socket.id);
  }
}
