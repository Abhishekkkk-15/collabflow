import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { InviteService } from './invite.service';
import { AcceptInviteDto } from './dto/create-invite.dto';
import { UpdateInviteDto } from './dto/update-invite.dto';
import { CurrentUser } from '../common/decorator/current-user.decorator';
import type { User } from '@prisma/client';
import { NotificationService } from '../notification/notification.service';
import { SendInviteDto } from './dto/send-invite.dto';
import { WsAuthorizationGuard } from '../common/guards/ws-authorization.guard';

@Controller('invite')
export class InviteController {
  constructor(private readonly inviteService: InviteService) {}

  @Post('/accept')
  create(@Body() dto: AcceptInviteDto, @CurrentUser() user: User) {
    return this.inviteService.acceptInvite(dto, user);
  }
  @UseGuards(WsAuthorizationGuard)
  @Post('workspace/:id')
  handleWorkspaceInvite(
    @Param('id') id: string,
    @Body() body: SendInviteDto,
    @CurrentUser() user: User,
  ) {
    console.log('id', id);
    this.inviteService.wsInvite(id, body, user);
  }

  @Get()
  findAll() {
    return this.inviteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inviteService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInviteDto: UpdateInviteDto) {
    return this.inviteService.update(+id, updateInviteDto);
  }

  @Delete('/reject/:id')
  remove(@Param('id') id: string) {
    return this.inviteService.reject(id);
  }
}
