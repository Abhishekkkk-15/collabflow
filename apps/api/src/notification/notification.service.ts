import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { User } from '@prisma/client';
import { prisma } from '@collabflow/db';
@Injectable()
export class NotificationService {
  create(createNotificationDto: CreateNotificationDto) {}

  async findAll(user: User) {
    const notifications = await prisma.notification.findMany({
      where: {
        userId: user.id,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
            email: true,
          },
        },
        actor: {
          select: {
            name: true,
            image: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return notifications;
  }

  async findOne(id: string) {
    return await prisma.notification.findUnique({
      where: {
        id,
      },
    });
  }

  async markAsRead(user: User) {
    await prisma.notification.updateMany({
      where: {
        AND: [{ userId: user.id }, { isRead: false }],
      },
      data: {
        isRead: true,
      },
    });

    return;
  }

  async remove(ids: string[]) {
    await prisma.notification.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }
}
