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
@WebSocketGateway({
  namespace: '/chat',
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },
})
export class chatWebsocketGateway {
  @WebSocketServer()
  io!: Server;
  constructor(private readonly chatService: ChatWSService) {}
  afterInit() {
    console.log('Socket.IO Server:', this.io);
    this.chatService.setServer(this.io);
  }
  async handleConnection(socket: Socket) {
    const userId = socket.handshake.auth.userId;
    if (!userId) return;
    console.log('its wokring');
    socket.data.userId = userId; // store user on socket

    // don't block other things — fetch in parallel
    const [workspaces, projects] = await Promise.all([
      prisma.workspace.findMany({
        where: { OR: [{ ownerId: userId }, { members: { some: { userId } } }] },
        select: { id: true, slug: true },
        take: 5,
      }),
      prisma.project.findMany({
        where: { OR: [{ ownerId: userId }, { members: { some: { userId } } }] },
        select: { id: true, slug: true },
        take: 5,
      }),
    ]);

    const MAX_JOIN = 50;
    workspaces
      .slice(0, MAX_JOIN)
      .forEach((ws) => this.chatService.joinWorkspaceRoom(socket, ws.slug!));
    projects
      .slice(0, MAX_JOIN)
      .forEach((p) => this.chatService.joinProjectRoom(socket, p.slug));
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
}
