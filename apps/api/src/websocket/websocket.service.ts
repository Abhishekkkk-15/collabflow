import { Injectable } from '@nestjs/common';
import { CreateWebsocketDto } from './dto/create-websocket.dto';
import { UpdateWebsocketDto } from './dto/update-websocket.dto';
import { Socket, Server } from 'socket.io';

@Injectable()
export class WebsocketService {
  private io!: Server;

  setServer(io: any) {
    this.io = io;
  }

  joinWorkspaceRoom(socket: Socket, workspaceId: string) {
    socket.join(`workspace:${workspaceId}`);
  }

  joinProjectRoom(socket: Socket, projectId: string) {
    socket.join(`project:${projectId}`);
  }

  joinUserRoom(socket: Socket, userId: string) {
    socket.join(`user:${userId}`);
  }
}
