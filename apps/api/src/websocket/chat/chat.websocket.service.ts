import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { Notification } from '@collabflow/types';
import { transformSocketToNotification } from '../../common/utils/transformNotifPayload';
import { prisma } from '@collabflow/db';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
@Injectable()
export class ChatWSService {
  private io!: Server;
  constructor(@InjectQueue('chatQueue') private chatQueue: Queue) {}
  setServer(io: any) {
    this.io = io as Server;
  }
  async handleMessages(socket: Socket, payload: any): Promise<any> {
    if (payload.mentionedUser !== null) {
      let notif = transformSocketToNotification({
        ...payload,
        event: 'MENTION',
      });
      this.chatQueue.add('chat:project', {
        roomId: payload.roomId,
        content: payload.text,
        user: payload.user,
      });
      this.io.to(`user:${payload.mentionedUser}`).emit('notification', {
        payload: notif,
        body: `You got menthion in workspace by ${payload.user.name}`,
        event: 'MENTIOIN',
      });
    }
    console.log('chat payload', payload);

    this.sendMessages(payload.roomId, 'message', payload);
  }

  async sendMessages(to: string, event: string, payload: any) {
    console.log('sending message', payload);
    this.io.to(to).emit(event, payload);
  }
  joinWorkspaceRoom(socket: Socket, workspaceSlug: string) {
    console.log('Joining user to Workspace', `workspace:${workspaceSlug}`);
    socket.join(`workspace:${workspaceSlug}`);
  }

  joinProjectRoom(socket: Socket, projectSlug: string) {
    console.log('Joining user to project');
    socket.join(`project:${projectSlug}`);
  }

  handleUserTyping(socket: Socket, payload: any) {
    this.sendMessages(payload.roomId, 'typing', payload);
  }
}
