import { Injectable, ForbiddenException } from '@nestjs/common';
import { prisma } from '@collabflow/db';
import { GetChatsDto } from './dto/get-chat.dto';
import { parseRoomId } from '../common/utils/parserRoomId';

@Injectable()
export class ChatService {
  async getMessages(roomId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const { slug } = parseRoomId(roomId);
    const [messages, total] = await prisma.$transaction([
      prisma.chatMessage.findMany({
        where: { slug },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          sender: {
            select: { id: true, name: true, image: true },
          },
        },
      }),
      prisma.chatMessage.count({ where: { slug } }),
    ]);

    return {
      messages,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateChat(chatId: string, userId: string, content: string) {
    const chat = await prisma.chatMessage.findUnique({
      where: { id: chatId },
    });

    if (!chat || chat.senderId !== userId) {
      throw new ForbiddenException('Cannot edit this message');
    }

    return prisma.chatMessage.update({
      where: { id: chatId },
      data: { content },
    });
  }

  async deleteChat(chatId: string, userId: string) {
    const chat = await prisma.chatMessage.findUnique({
      where: { id: chatId },
    });

    if (!chat || chat.senderId !== userId) {
      throw new ForbiddenException('Cannot delete this message');
    }

    return prisma.chatMessage.update({
      where: { id: chatId },
      data: { content: '[deleted]' },
    });
  }

  async markAsRead(userId: string, roomKey: string) {
    return prisma.chatReadState.upsert({
      where: {
        userId_roomKey: { userId, roomKey },
      },
      update: {
        lastReadAt: new Date(),
      },
      create: {
        userId,
        roomKey,
        lastReadAt: new Date(),
      },
    });
  }

  async getUnreadCount(userId: string, roomKey: string) {
    const { slug } = parseRoomId(roomKey);
    const readState = await prisma.chatReadState.findUnique({
      where: {
        userId_roomKey: { userId, roomKey },
      },
    });

    return prisma.chatMessage.count({
      where: {
        slug: slug,
        createdAt: {
          gt: readState?.lastReadAt ?? new Date(0),
        },
        senderId: { not: userId },
      },
    });
  }
}
