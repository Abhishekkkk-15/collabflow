import { Injectable } from '@nestjs/common';
import { CreateWebsocketDto } from './dto/create-websocket.dto';
import { UpdateWebsocketDto } from './dto/update-websocket.dto';
import { Socket, Server } from 'socket.io';

@Injectable()
export class WebsocketService {
  protected io!: Server;

  setServer(io: any) {
    this.io = io;
  }

  joinWorkspaceRoom(socket: Socket, workspaceSlug: string) {
    console.log('Joining user to Workspace', `workspace:${workspaceSlug}`);
    socket.join(`workspace:${workspaceSlug}`);
  }

  joinProjectRoom(socket: Socket, projectSlug: string) {
    console.log('Joining user to project');
    socket.join(`project:${projectSlug}`);
  }

  joinUserRoom(socket: Socket, userId: string) {
    socket.join(`user:${userId}`);
  }
}
