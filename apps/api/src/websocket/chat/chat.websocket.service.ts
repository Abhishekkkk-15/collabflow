import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@Injectable()
export class ChatWSService {
  private io!: Server;
  constructor() {}
  setServer(io: any) {
    this.io = io as Server;
  }
  async handleMessages(socket: Socket, payload: any): Promise<any> {
    console.log(socket.id, payload.roomId);
    this.sendMessages(payload.roomId, 'message', payload);
  }

  async sendMessages(to: string, event: string, payload: any) {
    this.io
      .to('workspace:email-scheduler_55e6847c88c14ee2')
      .emit(event, payload);
  }
  joinWorkspaceRoom(socket: Socket, workspaceSlug: string) {
    console.log('Joining user to Workspace', `workspace:${workspaceSlug}`);
    socket.join(`workspace:${workspaceSlug}`);
  }

  joinProjectRoom(socket: Socket, projectSlug: string) {
    console.log('Joining user to project');
    socket.join(`project:${projectSlug}`);
  }
}
