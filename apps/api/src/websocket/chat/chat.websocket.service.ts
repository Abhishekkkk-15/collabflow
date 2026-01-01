import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { Notification } from '@collabflow/types';
import { transformSocketToNotification } from '../../common/utils/transformNotifPayload';
import { prisma } from '@collabflow/db';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { parseRoomId } from '../../common/utils/parserRoomId';
@Injectable()
export class ChatWSService {
  private io!: Server;
  constructor(
    @InjectQueue('chatQueue') private chatQueue: Queue,
    @InjectQueue('taskQueue') private q: Queue,
  ) {}
  setServer(io: any) {
    this.io = io as Server;
  }
  async handleMessages(socket: Socket, payload: any): Promise<any> {
    const { scope, slug } = parseRoomId(payload.roomId);
    await this.chatQueue.add('chat:project', {
      roomId: slug,
      content: payload.text,
      user: payload.user,
      clientMessageId: payload.clientMessageId,
    });
    if (payload.mentionedUser !== null) {
      let notif = transformSocketToNotification({
        ...payload,
        event: 'MENTION',
      });
      this.io.to(`user:${payload.mentionedUser}`).emit('notification', {
        payload: notif,
        body: `You got menthion in workspace by ${payload.user.name}`,
        event: 'MENTIOIN',
      });
    }
    console.log('chat payload', payload);

    this.sendMessages(socket, payload.roomId, 'message', payload);
  }

  async sendMessages(socket: Socket, to: string, event: string, payload: any) {
    console.log('sending message', payload);
    this.io.to(to).emit(event, {
      clientMessageId: payload.clientMessageId,
      mentionedUser: payload?.mentionedUser,
      slug: payload.roomId,
      sender: payload.user,
      senderId: payload.id,
      content: payload.text,
    });
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
    this.sendMessages(socket, payload.roomId, 'typing', payload);
  }
}
