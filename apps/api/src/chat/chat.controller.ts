import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { GetChatsDto } from './dto/get-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { CurrentUser } from '../common/decorator/current-user.decorator';
import { type User } from '@prisma/client';
// import { CurrentUser } from '../auth/current-user.decorator';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get(':roomId')
  getChats(
    @Param('roomId') roomId: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ) {
    return this.chatService.getMessages(roomId, +page, +limit);
  }

  @Patch(':id')
  updateChat(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() dto: UpdateChatDto,
  ) {
    return this.chatService.updateChat(id, user.id, dto.content);
  }

  @Delete(':id')
  deleteChat(@Param('id') id: string, @CurrentUser() user: User) {
    return this.chatService.deleteChat(id, user.id);
  }

  @Patch('read/:roomKey')
  markAsRead(@Param('roomKey') roomKey: string, @CurrentUser() user: User) {
    return this.chatService.markAsRead(user.id, roomKey);
  }

  @Get('unread/:roomKey')
  getUnread(@Param('roomKey') roomKey: string, @CurrentUser() user: User) {
    return this.chatService.getUnreadCount(user.id, roomKey);
  }
}
