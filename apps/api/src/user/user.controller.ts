import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../common/guards/AuthGuard';
import { WsAuthorizationGuard } from '../common/guards/ws-authorization.guard';
import { CurrentUser } from '../common/decorator/current-user.decorator';
import type { User } from '@prisma/client';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll(@CurrentUser() user: User) {
    return this.userService.findAll(user);
  }

  @Get('/roles')
  @UseGuards(AuthGuard)
  currentUserRoles(@Req() req: any) {
    console.log('user comming here', req.user.id);
    return this.userService.currentUserRoles(req.user.id);
  }

  @Get('/workspaces/:wsId/users')
  @UseGuards(WsAuthorizationGuard)
  usersNotInWs(@Param('wsId') wsId: string) {
    return this.userService.findAllUserNotInWs(wsId);
  }
  @Get('/project/:pId/users')
  // @UseGuards()
  usersNotInP(@Param('pId') wsId: string) {
    return this.userService.findAllUserNotInP(wsId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
