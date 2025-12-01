import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { User } from '@prisma/client';
import { prisma } from '@collabflow/db';
@Injectable()
export class NotificationService {
  create(createNotificationDto: CreateNotificationDto) {}

  async findAll(user: User) {
    return await prisma.notification.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} notification`;
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

    return 'Updated';
  }

  remove(id: number) {
    return `This action removes a #${id} notification`;
  }
}
