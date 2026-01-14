import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { CurrentUser } from '../common/decorator/current-user.decorator';
import type { User } from '@prisma/client';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.notificationService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationService.findOne(id);
  }

  @Patch('')
  markAllAsRead(@CurrentUser() user: User) {
    return this.notificationService.markAsRead(user);
  }

  @Delete('')
  remove(@Body() body: { ids: string[] }) {
    return this.notificationService.remove(body.ids);
  }
}
